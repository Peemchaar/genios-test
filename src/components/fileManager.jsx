import { useEffect, useState, useRef } from "react"
import { upload } from "../assets"
import '../styles/fileManager.scss'
import ProgressBar from "./common/progressBar";

const FileManager = () => {
    const inputRef = useRef();

    const [selectedFile, setSelectedFile] = useState(new Blob);
    const [loading, setLoading] = useState(false);
    const rowEval = /^[0-9]{1,4}$/;
    const strEval = /^\s[0-9a-zA-Z#@]/;
    const decimalEval = /^[1-9][0-9]? /;
    const endOfRowEval = /^\d{3,7}/;

    const onFileUpload = () => {
        inputRef.current.click();
    }

    const onFileChange = event => {
        if(event.target.files && event.target.files.length > 0){
            const file = event.target.files[0]
            if(file.type !== 'text/csv'){
                alert('Formato de archivo incorrecto.')
                return
            }

            setSelectedFile(file);
        }
    };

    const processFile = () =>{
        const reader = new FileReader();
        reader.onload = (event) => {
            const csvData = event.target.result;
            const rows = csvData.split('\n');
            let parsedRows = []
            let tempRow = []
            for (let row of rows) {
                if(row !== ';;;'){
                    let splitEval = row.split(',')
                    if(splitEval.length){
                        let fixSplit = []
                        let fixedStr = ''
                        if(splitEval.length === 6 && (rowEval.test(splitEval[0].replace(/"/g, "")) &&  endOfRowEval.test(splitEval[splitEval.length - 1]))){
                            fixSplit = splitEval
                        }else{
                            for (let i = 0; i < splitEval.length; i++){
                                let item = splitEval[i]
                                if((strEval.test(item) || decimalEval.test(item))){
                                    fixedStr = `${fixedStr},${item}`;
                                }else{ 
                                    if(fixedStr.length > 0){
                                        fixSplit.push(fixedStr)
                                    }
                                    fixedStr = item;
                                }
                                if(splitEval.length === i+1){
                                    fixSplit.push(fixedStr)
                                }
                            }
                        }
                        if(rowEval.test(fixSplit[0].replace(/"/g, ""))){
                            for (let str of tempRow) {
                                str = str.replace(';;;','')
                                str = str.replace(/"/g, "")
                            }
                            parsedRows.push(tempRow)
                            tempRow = []
                            tempRow.length = 0
                            if(fixSplit.length === 6){
                                if(endOfRowEval.test(fixSplit[5])){
                                    parsedRows.push(fixSplit)
                                }else{
                                    for (let i = 0; i < fixSplit.length; i++) {
                                        fixSplit[i] = fixSplit[i].replace(';;;','')
                                        fixSplit[i] = fixSplit[i].replace(/"/g, "")
                                    }
                                    fixSplit[1] = `${fixSplit[1]},${fixSplit[2]},${fixSplit[3]},${fixSplit[4]},${fixSplit[5]}`
                                    fixSplit.splice(2, 4);
                                }
                            }else{
                                for (const str of fixSplit) {
                                    if(endOfRowEval.test(str)){
                                        tempRow.push(str)
                                    }else{
                                        if(tempRow.length > 1){
                                            tempRow[tempRow.length - 1] = `${tempRow[tempRow.length - 1]},${str}`
                                        }else{
                                            tempRow.push(str)
                                        }
                                    }
                                }
                            }
                        }else{
                            for (const str of fixSplit) {
                                if(endOfRowEval.test(str)){
                                    tempRow.push(str)
                                }else{
                                    if(endOfRowEval.test(tempRow[tempRow.length - 1]) && tempRow.length === 6){
                                        for (let str of tempRow) {
                                            str = str.replace(';;;','')
                                            str = str.replace(/"/g, "")
                                        }
                                        parsedRows.push(tempRow)
                                        tempRow = []
                                        tempRow.length = 0
                                        let searchIndex = str.indexOf(",");
                                        if(searchIndex && searchIndex >=2 && searchIndex <=4){
                                            const part1 = str.substring(0, searchIndex);
                                            const part2 = str.substring(searchIndex + 1);
                                            tempRow.push(part1)
                                            tempRow.push(part2)
                                        }
                                    }else{
                                        if(tempRow.length > 1){
                                            tempRow[tempRow.length - 1] = `${tempRow[tempRow.length - 1]},${str}`
                                        }else{
                                            tempRow.push(str)
                                        }
                                    }
                                    
                                }
                            }
                        }
                    }
                }
            }
            parsedRows = parsedRows.filter(row => row.length)
            for (let i = 1; i < parsedRows.length; i++) {
                let row = parsedRows[i];
                let nextRow = i < parsedRows.length - 1? parsedRows[i+1] : null;
                if(row.length === 5 ){
                    if(row[1].slice(-3)[0] === ','){
                        const part1 = row[1].slice(0, - 3);
                        const part2 = row[1].slice(-2);
                        row[1] = part1
                        row.splice(2,0, part2)
                    }else if(row[2].slice(-3)[0] === ','){
                        const part1 = row[2].slice(0, - 3);
                        const part2 = row[2].slice(-2);
                        row[2] = part1
                        row.splice(3,0, part2)
                    }else if(row[3].slice(-3)[0] === ','){
                        const part1 = row[3].slice(0, - 3);
                        const part2 = row[3].slice(-2);
                        row[3] = part1
                        row.splice(4,0, part2)
                    }else if(row[4].slice(-3)[0] === ','){
                        const part1 = row[4].slice(0, - 3);
                        const part2 = row[4].slice(-2);
                        row[4] = part1
                        row.push(part2)
                    }
                } 
                if(row.length === 2){
                    row[1] = `${row[1]}${nextRow[0]},${nextRow[1]}`
                    row[2] = nextRow[2]
                    row[3] = nextRow[3]
                    row[4] = nextRow[4]
                    row[5] = nextRow[5]
                    parsedRows.splice(i+1,1)
                }
            }
            console.log("FINAL DATA: ", parsedRows)
        };
        reader.readAsText(selectedFile);
    }



    useEffect(() => {
        if(selectedFile.size > 0){
            processFile();
        } 
    }, [selectedFile])


    return (
        <div className="manager-container px-3 py-3">
            {
                !loading?
                <div className="upload-container flex flex-col items-center justify-center gap-3 pointer py-3" onClick={onFileUpload}>
                    <img src={upload} alt="upload-logo" />
                    <span>Carga de archivo .CSV</span>
                    <input className="hidden" type="file" ref={inputRef} onChange={onFileChange} />
                </div>
                :
                <ProgressBar progress={25}/>
            }
            
        </div>
    )
}

export default FileManager
