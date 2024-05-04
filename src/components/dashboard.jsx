import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Header from "./header"
import FileManager from "./fileManager"

const Dashboard = () => {

    const navigate = useNavigate()


    return (
        <div>
            <Header />
            <FileManager/>
        </div> 
    )
}

export default Dashboard