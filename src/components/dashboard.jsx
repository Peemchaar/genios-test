import { useEffect, useState } from "react";
import Header from "./header";
import FileManager from "./fileManager";
import '../styles/dashboard.scss';
import { share, favorite, comment } from "../assets";
import apiClient from '../services/axios.service'
import { Tab } from "@mui/material";
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { PieChart } from "@mui/x-charts";

const Dashboard = () => {
    const [loading, setLoading] = useState(false);
    const [currentProgress, setCurrentProgress] = useState(0.00);
    const [incrementRate, setIncrementRate] = useState(0);
    const [dataParsed, setDataParsed] = useState([]);
    const [postCount, setPostCount] = useState(0);
    const [reactionsCount, setReactionsCount] = useState(0);
    const [popularPost, setPopularPost] = useState('');
    const [popularPostReplies, setpopularPostReplies] = useState(0);
    const [popularPostLikes, setPopularPostLikes] = useState(0);
    const [popularPostShared, setPopularPostShared] = useState(0);
    const [topHashtags, setTopHashtags] = useState([]);
    const [topMentions, setTopMentions] = useState([]);
    const [fetchSentiments, setFetchSentiments] = useState(false);
    const [fetchEmotions, setFetchEmotions] = useState(false);
    const [tabValue, setTabValue] = useState('1');

    const [positiveData, setPositiveData] = useState({
        positiveValue: '0',
        positiveComments: '0',
        positiveLikes: '0',
        positiveShares: '0',
    });

    const [negativeData, setNegativeData] = useState({
        negativeValue: '0',
        negativeComments: '0',
        negativeLikes: '0',
        negativeShares: '0',
    });

    const [neutralData, setNeutralData] = useState({
        neutralValue: '0',
        neutralComments: '0',
        neutralLikes: '0',
        neutralShares: '0',
    });

    const [joyData, setJoyData] = useState({
        value: '0',
        comments: '0',
        likes: '0',
        shares: '0',
    });
    const [othersData, setOthersData] = useState({
        value: '0',
        comments: '0',
        likes: '0',
        shares: '0',
    });
    const [surpriseData, setSurpriseData] = useState({
        value: '0',
        comments: '0',
        likes: '0',
        shares: '0',
    });
    const [fearData, setFearData] = useState({
        value: '0',
        comments: '0',
        likes: '0',
        shares: '0',
    });
    const [sadnessData, setSadnessData] = useState({
        value: '0',
        comments: '0',
        likes: '0',
        shares: '0',
    });
    const [disgustData, setDisgustData] = useState({
        value: '0',
        comments: '0',
        likes: '0',
        shares: '0',
    });
    const [angerData, setAngerData] = useState({
        value: '0',
        comments: '0',
        likes: '0',
        shares: '0',
    });


    const customColors = {
        emotions: [
            '#F72585',
            '#7209B7',
            '#959595'
        ],
        secondary: [
            '#F72585',
            '#7209B7',
            '#4CC9F0'
        ],
        sentiments: [
            '#84F726',
            '#3A0CA3',
            '#F79926',
            '#9B51E0',
            '#56CCF2',
            '#F72585',
            '#959595'
        ]
    }

    const hastagEval = /#[\w]+/g;
    const mentionEval = /@\w+/g;

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
      };

    const countReactions = () => {
        let counter = 0
        for (let post of dataParsed) {
            counter += parseInt(post[5])
        }
        setReactionsCount(counter)
    }

    function top3Generator(data){
        const wordCounts = {};
        data.forEach((word) => {
            if (wordCounts[word]) {
                wordCounts[word]++;
            } else {
                wordCounts[word] = 1;
            }
        });
        const wordPairs = Object.entries(wordCounts);
        wordPairs.sort((a, b) => b[1] - a[1]);
        return wordPairs.slice(0, 3);
    }

    const countHashtags = () => {
        let hashtags = [];
        for (let post of dataParsed) {
           let matches = post[1].match(hastagEval);
           if(matches != null){
                if(matches.length > 1){
                    matches.forEach(element => {
                        hashtags.push(element)
                    });
                }else{
                    hashtags.push(matches)
                }
           }
        }
        const hastagSorted = top3Generator(hashtags).map(([word, count]) => word);
        setTopHashtags(hastagSorted)
    }

    const countMentions = () => {
        let mentions = [];
        for (let post of dataParsed) {
           let matches = post[1].match(mentionEval);
           if(matches != null){
            if(matches.length > 1){
                matches.forEach(element => {
                    mentions.push(element)
                });
            }else{
                mentions.push(matches)
            }
           }
           
        }
        const mentionSorted = top3Generator(mentions).map(([word, count]) => word);
        setTopMentions(mentionSorted)
    }

    const updateProgress = () => {
        setTimeout(() => {
            setCurrentProgress((prevContador) => parseFloat(prevContador) + parseFloat(incrementRate));
        }, 30);
    }

    const searchPopularPostData = () => {
        let popularPost = []
        for (let post of dataParsed) {
            if(popularPost.length > 0){
                if(parseInt(post[5]) > parseInt(popularPost[5])){
                    popularPost = post
                }
            }else{
                popularPost = post
            }
        }
        setPopularPost(popularPost[1]);
        setPopularPostLikes(popularPost[2]);
        setpopularPostReplies(popularPost[3]);
        setPopularPostShared(popularPost[4]);
    }

    async function analyser(){
        let totalPosts = dataParsed.length
        if(totalPosts > 250){
            alert('Lo sentimos, el archivo que acaba de suministrar es muy pesado y el servidor es algo perezoso 😥. Solo puede procesar aproximadamente 500 peticiones por hora de forma gratuita, tomaremos los primeros 250 registros para procesar las emociones y sentimientos. Por favor acorte el tamaño de su archivo e intente luego con el resto de registros.')
            setIncrementRate((prevIncrementRate) => parseFloat(prevIncrementRate) + (100 / 250));
        }else{
            setIncrementRate((prevIncrementRate) => parseFloat(prevIncrementRate) + (100 / totalPosts));
        }

        setPostCount(totalPosts)
        countReactions();
        countHashtags();
        countMentions();
        searchPopularPostData();
        
        setFetchSentiments(true);
        setFetchEmotions(true);

    }

    useEffect(() => {
        
    }, [loading, currentProgress])

    useEffect(() => {
        if(dataParsed.length){
            setLoading(true)
            analyser()
        }
    }, [dataParsed])

    useEffect(() => {
    }, [postCount,reactionsCount,popularPost,popularPostReplies,popularPostLikes,popularPostShared,topHashtags,topMentions])

    useEffect(() => {
        
            const fetchSentimentsData = async () => {
                try{ 
                    for (let index = 0; index < 250; index++) {
                        const post = dataParsed[index];
                        let data = post[1].toString()
                        const response = await apiClient.post(`/beto-sentiment-analysis`,  data );

                        if(response.data[0].length){
                            updateProgress()
                            for (const value of response.data[0]) {

                                if(value.score > 0.51){
                                    switch (value.label) {
                                        case 'NEU':
                                            setTimeout(() => {
                                                setNeutralData((prevNeutralData) => ({
                                                    ...prevNeutralData,
                                                    neutralValue: parseInt(prevNeutralData.neutralValue) + 1,
                                                    neutralLikes: parseInt(prevNeutralData.neutralLikes) + parseInt(post[2]),
                                                    neutralComments: parseInt(prevNeutralData.neutralComments) + parseInt(post[3]),
                                                    neutralShares: parseInt(prevNeutralData.neutralShares) + parseInt(post[4])
                                                }));
                                            }, 10);
                                            break;
                                        case 'POS':

                                            setTimeout(() => {
                                                setPositiveData((prevPositiveData) => ({
                                                    ...prevPositiveData,
                                                    positiveValue: parseInt(prevPositiveData.positiveValue) + 1,
                                                    positiveLikes: parseInt(prevPositiveData.positiveLikes) + parseInt(post[2]),
                                                    positiveComments: parseInt(prevPositiveData.positiveComments) + parseInt(post[3]),
                                                    positiveShares: parseInt(prevPositiveData.positiveShares) + parseInt(post[4])
                                                }));
                                            }, 10);

                                            break;
                                        case 'NEG':

                                            setTimeout(() => {
                                                setNegativeData((prevNegativeData) => ({
                                                    ...prevNegativeData,
                                                    negativeValue: parseInt(prevNegativeData.negativeValue) + 1,
                                                    negativeLikes: parseInt(prevNegativeData.negativeLikes) + parseInt(post[2]),
                                                    negativeComments: parseInt(prevNegativeData.negativeComments) + parseInt(post[3]),
                                                    negativeShares: parseInt(prevNegativeData.negativeShares) + parseInt(post[4])
                                                }));
                                            }, 10);

                                            break;
                                        default:
                                            break;
                                    }
                                }
                                
                            }
                        }
                    }
                }catch (error) {
                    if(error.response.status === 429){
                        alert("El servidor esta cansado en este momento 😫, dejemos que descanse e intentemos de nuevo en 1 hora aproximadamente")
                    }
                    console.error('Error al hacer la petición:', error);
                }
            };
        if(fetchSentiments){
            fetchSentimentsData();
        }
    }, [fetchSentiments])

    useEffect(() => {
        
        const fetchEmotionsData = async () => {
            try{ 
                for (let index = 0; index < 250; index++) {
                    const post = dataParsed[index];
                    let data = post[1].toString()
                    const response = await apiClient.post(`/beto-emotion-analysis`,  data );

                    if(response.data[0].length){
                        for (const value of response.data[0]) {
                            if(value.score > 0.51){
                                switch (value.label) {
                                    case 'joy':
                                        setTimeout(() => {
                                            setJoyData((prevJoyData) => ({
                                                ...prevJoyData,
                                                value: parseInt(prevJoyData.value) + 1,
                                                likes: parseInt(prevJoyData.likes) + parseInt(post[2]),
                                                comments: parseInt(prevJoyData.comments) + parseInt(post[3]),
                                                shares: parseInt(prevJoyData.shares) + parseInt(post[4])
                                            }));
                                        }, 10);
                                        break;
                                    case 'others':
                                        setTimeout(() => {
                                            setOthersData((prevOthersData) => ({
                                                ...prevOthersData,
                                                value: parseInt(prevOthersData.value) + 1,
                                                likes: parseInt(prevOthersData.likes) + parseInt(post[2]),
                                                comments: parseInt(prevOthersData.comments) + parseInt(post[3]),
                                                shares: parseInt(prevOthersData.shares) + parseInt(post[4])
                                            }));
                                        }, 10);
                                        break;
                                    case 'surprise':
                                        setTimeout(() => {
                                            setSurpriseData((prevSurprisedData) => ({
                                                ...prevSurprisedData,
                                                value: parseInt(prevSurprisedData.value) + 1,
                                                likes: parseInt(prevSurprisedData.likes) + parseInt(post[2]),
                                                comments: parseInt(prevSurprisedData.comments) + parseInt(post[3]),
                                                shares: parseInt(prevSurprisedData.shares) + parseInt(post[4])
                                            }));
                                        }, 10);
                                        break;
                                    case 'fear':
                                        setTimeout(() => {
                                            setFearData((prevFearData) => ({
                                                ...prevFearData,
                                                value: parseInt(prevFearData.value) + 1,
                                                likes: parseInt(prevFearData.likes) + parseInt(post[2]),
                                                comments: parseInt(prevFearData.comments) + parseInt(post[3]),
                                                shares: parseInt(prevFearData.shares) + parseInt(post[4])
                                            }));
                                        },10);
                                        break;
                                    case 'sadness':
                                        setTimeout(() => {
                                            setSadnessData((prevSadnessData) => ({
                                                ...prevSadnessData,
                                                value: parseInt(prevSadnessData.value) + 1,
                                                likes: parseInt(prevSadnessData.likes) + parseInt(post[2]),
                                                comments: parseInt(prevSadnessData.comments) + parseInt(post[3]),
                                                shares: parseInt(prevSadnessData.shares) + parseInt(post[4])
                                            }));
                                        }, 10);
                                        break;
                                    case 'disgust':
                                        setTimeout(() => {
                                            setDisgustData((prevDisgustData) => ({
                                                ...prevDisgustData,
                                                value: parseInt(prevDisgustData.value) + 1,
                                                likes: parseInt(prevDisgustData.likes) + parseInt(post[2]),
                                                comments: parseInt(prevDisgustData.comments) + parseInt(post[3]),
                                                shares: parseInt(prevDisgustData.shares) + parseInt(post[4])
                                            }));
                                        }, 10);
                                        break;
                                    case 'anger':
                                        setTimeout(() => {
                                            setAngerData((prevAngerData) => ({
                                                ...prevAngerData,
                                                value: parseInt(prevAngerData.value) + 1,
                                                likes: parseInt(prevAngerData.likes) + parseInt(post[2]),
                                                comments: parseInt(prevAngerData.comments) + parseInt(post[3]),
                                                shares: parseInt(prevAngerData.shares) + parseInt(post[4])
                                            }));
                                        }, 10);
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                    }
                }
            }catch (error) {
                if(error.response.status === 429){
                    alert("El servidor esta cansado en este momento 😫, dejemos que descanse e intentemos de nuevo en 1 hora aproximadamente")
                }
                console.error('Error al hacer la petición:', error);
            }
        };

    if(fetchEmotions){
        fetchEmotionsData();
    }
    

}, [fetchEmotions])

    useEffect(() => {

    }, [positiveData, negativeData, neutralData])
    
    return (
        <>
            <Header />
            <FileManager loading={loading} progress={currentProgress} processed={(data) => {setDataParsed(data)}}/>
            {
                dataParsed.length?
                <div className="global-analysis flex flex-col">
                    <div className="post-react flex justify-between">
                        <div className="box flex flex-col">
                            <span className="title roboto-medium">
                                Publicaciones
                            </span>
                            <span className="subtitle roboto-regular">
                                Totales encontradas
                            </span>
                            <span className="value roboto-medium">
                                {postCount}
                            </span>
                        </div>
                        <div className="box flex flex-col">
                            <span className="title roboto-medium">
                                Reacciones
                            </span>
                            <span className="subtitle roboto-regular">
                                Totales encontradas
                            </span>
                            <span className="value roboto-medium">
                                {reactionsCount}
                            </span>
                        </div>
                    </div>
                    <div className="top-container flex justify-between">
                        <div className="box flex flex-col">
                            <span className="title roboto-medium">
                                Tendencia
                            </span>
                            <span className="subtitle roboto-regular">
                                Temas en tendencia
                            </span>
                            <div className="pill-container">
                                {topHashtags.map((hashtag, index) => (
                                    <div className="top-pill flex items-center" key={index}>
                                        <span className="text roboto-regular">
                                            {hashtag}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="box flex flex-col">
                            <span className="title roboto-medium">
                                Menciones
                            </span>
                            <span className="subtitle roboto-regular">
                                Más usadas
                            </span>
                            <div className="pill-container">
                                {topMentions.map((mention, index) => (
                                    <div className="top-pill flex items-center" key={index}>
                                        <span className="text roboto-regular">
                                            {mention}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="box flex flex-col">
                            <span className="title roboto-medium">
                                Publicación destacada
                            </span>
                            <span className="subtitle roboto-regular">
                                Con mas reacciones encontradas
                            </span>
                            <p className="post-content roboto-regular">
                                {popularPost}
                            </p>
                            <div className="reactions-container flex justify-between">
                                <div className="mini-box flex justify-start">
                                    <img src={comment} alt="comment-icon" />
                                    <div className="flex flex-col mx-1">
                                        <span className="subtitle roboto-medium">
                                            Comentarios
                                        </span>
                                        <span className="value roboto-medium">
                                            {popularPostReplies}
                                        </span>
                                    </div>
                                </div>
                                <div className="mini-box flex justify-start">
                                    <img src={favorite} alt="comment-icon" />
                                    <div className="flex flex-col mx-1">
                                        <span className="subtitle roboto-medium">
                                            Me gusta
                                        </span>
                                        <span className="value roboto-medium">
                                            {popularPostLikes}
                                        </span>
                                    </div>
                                </div>
                                <div className="mini-box flex justify-start">
                                    <img src={share} alt="comment-icon" />
                                    <div className="flex flex-col mx-1">
                                        <span className="subtitle roboto-medium">
                                            Compartido
                                        </span>
                                        <span className="value roboto-medium">
                                            {popularPostShared}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="graph-container">
                        <TabContext value={tabValue}>
                            <TabList indicatorColor="secondary" variant="fullWidth" onChange={handleTabChange} aria-label="lab API tabs example">
                                <Tab color="#140109" label="Sentimientos" value="1"  />
                                <Tab label="Emociones" value="2" />
                            </TabList>
                            <TabPanel value="1">
                                <div className="main-graph-container flex flex-col items-center">
                                    <span className="title roboto-regular">
                                        Sentimientos en publicaciones
                                    </span>
                                    <div className="indicators flex flex-col justify-start">
                                        <span className="title roboto-regular">
                                            {parseInt(positiveData.positiveValue)+parseInt(negativeData.negativeValue)+parseInt(neutralData.neutralValue)}
                                        </span>
                                        <span className="subtitle roboto-regular">
                                            Publicaciones
                                        </span>
                                    </div>
                                    <PieChart
                                        colors={customColors.emotions}
                                        series={[
                                            {
                                            data: [
                                                { id: 0, value: positiveData.positiveValue, label: 'Positivas' },
                                                { id: 1, value: negativeData.negativeValue, label: 'Negativas' },
                                                { id: 2, value: neutralData.neutralValue, label: 'Neutrales' }
                                            ],
                                            innerRadius: 80,
                                            outerRadius: 100,
                                            paddingAngle: 1,
                                            startAngle: 0,
                                            endAngle: 360
                                            },
                                        ]}
                                        width={600}
                                        height={345}
                                    />
                                </div>
                                <div className="secondary-graph-container flex justify-start">
                                    <div className="inner-container flex justify-start">
                                        <div className="graph-card flex flex-col items-center">
                                            <span className="title roboto-regular">
                                                Publicaciones positivas
                                            </span>
                                            <PieChart
                                                colors={customColors.secondary}
                                                series={[
                                                    {
                                                    data: [
                                                        { id: 0, value: positiveData.positiveComments, label: 'Comentarios' },
                                                        { id: 1, value: positiveData.positiveLikes, label: 'Me gusta' },
                                                        { id: 2, value: positiveData.positiveShares, label: 'Compartidos' }
                                                    ],
                                                    innerRadius: 80,
                                                    outerRadius: 100,
                                                    paddingAngle: 1,
                                                    startAngle: 0,
                                                    endAngle: 360
                                                    },
                                                ]}
                                                width={518}
                                                height={220}
                                            />
                                        </div>
                                        <div className="graph-card flex flex-col items-center">
                                            <span className="title roboto-regular">
                                                Publicaciones negativas
                                            </span>
                                            <PieChart
                                                colors={customColors.secondary}
                                                series={[
                                                    {
                                                    data: [
                                                        { id: 0, value: negativeData.negativeComments, label: 'Comentarios' },
                                                        { id: 1, value: negativeData.negativeLikes, label: 'Me gusta' },
                                                        { id: 2, value: negativeData.negativeShares, label: 'Compartidos' }
                                                    ],
                                                    innerRadius: 80,
                                                    outerRadius: 100,
                                                    paddingAngle: 1,
                                                    startAngle: 0,
                                                    endAngle: 360
                                                    },
                                                ]}
                                                width={518}
                                                height={220}
                                            />
                                        </div>
                                        <div className="graph-card flex flex-col items-center">
                                            <span className="title roboto-regular">
                                                Publicaciones neutrales
                                            </span>
                                            <PieChart
                                                colors={customColors.secondary}
                                                series={[
                                                    {
                                                    data: [
                                                        { id: 0, value: neutralData.neutralComments, label: 'Comentarios' },
                                                        { id: 1, value: neutralData.neutralLikes, label: 'Me gusta' },
                                                        { id: 2, value: neutralData.neutralShares, label: 'Compartidos' }
                                                    ],
                                                    innerRadius: 80,
                                                    outerRadius: 100,
                                                    paddingAngle: 1,
                                                    startAngle: 0,
                                                    endAngle: 360
                                                    },
                                                ]}
                                                width={518}
                                                height={220}
                                            />
                                        </div>
                                    </div>
                                    
                                </div>
                            </TabPanel>
                            <TabPanel value="2">
                                <div className="main-graph-container flex flex-col items-center">
                                    <span className="title roboto-regular">
                                        Sentimientos en publicaciones
                                    </span>
                                    <div className="indicators flex flex-col justify-start">
                                        <span className="title roboto-regular">
                                            {parseInt(positiveData.positiveValue)+parseInt(negativeData.negativeValue)+parseInt(neutralData.neutralValue)}
                                        </span>
                                        <span className="subtitle roboto-regular">
                                            Publicaciones
                                        </span>
                                    </div>
                                    <PieChart
                                        colors={customColors.sentiments}
                                        series={[
                                            {
                                            data: [
                                                { id: 0, value: parseInt(joyData.value), label: 'Alegría' },
                                                { id: 1, value: parseInt(surpriseData.value), label: 'Sorpresa' },
                                                { id: 2, value: parseInt(fearData.value), label: 'Miedo' },
                                                { id: 3, value: parseInt(sadnessData.value), label: 'Tristeza' },
                                                { id: 4, value: parseInt(disgustData.value), label: 'Disgusto' },
                                                { id: 5, value: parseInt(angerData.value), label: 'Ira' },
                                                { id: 6, value: parseInt(othersData.value), label: 'Otras' },
                                            ],
                                            innerRadius: 80,
                                            outerRadius: 100,
                                            paddingAngle: 1,
                                            startAngle: 0,
                                            endAngle: 360
                                            },
                                        ]}
                                        width={600}
                                        height={345}
                                />
                                </div>
                                <div className="secondary-graph-container flex justify-start">
                                    <div className="inner-container flex justify-start">
                                        <div className="graph-card flex flex-col items-center">
                                            <span className="title roboto-regular">
                                                Publicaciones alegres
                                            </span>
                                            <PieChart
                                                colors={customColors.secondary}
                                                series={[
                                                    {
                                                    data: [
                                                        { id: 0, value: joyData.comments, label: 'Comentarios' },
                                                        { id: 1, value: joyData.likes, label: 'Me gusta' },
                                                        { id: 2, value: joyData.shares, label: 'Compartidos' }
                                                    ],
                                                    innerRadius: 80,
                                                    outerRadius: 100,
                                                    paddingAngle: 1,
                                                    startAngle: 0,
                                                    endAngle: 360
                                                    },
                                                ]}
                                                width={518}
                                                height={220}
                                            />
                                        </div>
                                        <div className="graph-card flex flex-col items-center">
                                            <span className="title roboto-regular">
                                                Publicaciones sorpresivas
                                            </span>
                                            <PieChart
                                                colors={customColors.secondary}
                                                series={[
                                                    {
                                                    data: [
                                                        { id: 0, value: surpriseData.comments, label: 'Comentarios' },
                                                        { id: 1, value: surpriseData.likes, label: 'Me gusta' },
                                                        { id: 2, value: surpriseData.shares, label: 'Compartidos' }
                                                    ],
                                                    innerRadius: 80,
                                                    outerRadius: 100,
                                                    paddingAngle: 1,
                                                    startAngle: 0,
                                                    endAngle: 360
                                                    },
                                                ]}
                                                width={518}
                                                height={220}
                                            />
                                        </div>
                                        <div className="graph-card flex flex-col items-center">
                                            <span className="title roboto-regular">
                                                Publicaciones tristes
                                            </span>
                                            <PieChart
                                                colors={customColors.secondary}
                                                series={[
                                                    {
                                                    data: [
                                                        { id: 0, value: sadnessData.comments, label: 'Comentarios' },
                                                        { id: 1, value: sadnessData.likes, label: 'Me gusta' },
                                                        { id: 2, value: sadnessData.shares, label: 'Compartidos' }
                                                    ],
                                                    innerRadius: 80,
                                                    outerRadius: 100,
                                                    paddingAngle: 1,
                                                    startAngle: 0,
                                                    endAngle: 360
                                                    },
                                                ]}
                                                width={518}
                                                height={220}
                                            />
                                        </div>
                                        <div className="graph-card flex flex-col items-center">
                                            <span className="title roboto-regular">
                                                Publicaciones desagradables
                                            </span>
                                            <PieChart
                                                colors={customColors.secondary}
                                                series={[
                                                    {
                                                    data: [
                                                        { id: 0, value: disgustData.comments, label: 'Comentarios' },
                                                        { id: 1, value: disgustData.likes, label: 'Me gusta' },
                                                        { id: 2, value: disgustData.shares, label: 'Compartidos' }
                                                    ],
                                                    innerRadius: 80,
                                                    outerRadius: 100,
                                                    paddingAngle: 1,
                                                    startAngle: 0,
                                                    endAngle: 360
                                                    },
                                                ]}
                                                width={518}
                                                height={220}
                                            />
                                        </div>
                                        <div className="graph-card flex flex-col items-center">
                                            <span className="title roboto-regular">
                                                Publicaciones molestas
                                            </span>
                                            <PieChart
                                                colors={customColors.secondary}
                                                series={[
                                                    {
                                                    data: [
                                                        { id: 0, value: angerData.comments, label: 'Comentarios' },
                                                        { id: 1, value: angerData.likes, label: 'Me gusta' },
                                                        { id: 2, value: angerData.shares, label: 'Compartidos' }
                                                    ],
                                                    innerRadius: 80,
                                                    outerRadius: 100,
                                                    paddingAngle: 1,
                                                    startAngle: 0,
                                                    endAngle: 360
                                                    },
                                                ]}
                                                width={518}
                                                height={220}
                                            />
                                        </div>
                                        <div className="graph-card flex flex-col items-center">
                                            <span className="title roboto-regular">
                                                Publicaciones temerosas
                                            </span>
                                            <PieChart
                                                colors={customColors.secondary}
                                                series={[
                                                    {
                                                    data: [
                                                        { id: 0, value: fearData.comments, label: 'Comentarios' },
                                                        { id: 1, value: fearData.likes, label: 'Me gusta' },
                                                        { id: 2, value: fearData.shares, label: 'Compartidos' }
                                                    ],
                                                    innerRadius: 80,
                                                    outerRadius: 100,
                                                    paddingAngle: 1,
                                                    startAngle: 0,
                                                    endAngle: 360
                                                    },
                                                ]}
                                                width={518}
                                                height={220}
                                            />
                                        </div>
                                        <div className="graph-card flex flex-col items-center">
                                            <span className="title roboto-regular">
                                                Publicaciones indeterminadas
                                            </span>
                                            <PieChart
                                                colors={customColors.secondary}
                                                series={[
                                                    {
                                                    data: [
                                                        { id: 0, value: othersData.comments, label: 'Comentarios' },
                                                        { id: 1, value: othersData.likes, label: 'Me gusta' },
                                                        { id: 2, value: othersData.shares, label: 'Compartidos' }
                                                    ],
                                                    innerRadius: 80,
                                                    outerRadius: 100,
                                                    paddingAngle: 1,
                                                    startAngle: 0,
                                                    endAngle: 360
                                                    },
                                                ]}
                                                width={518}
                                                height={220}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabContext>
                    </div>
                    
                </div>
                :
                null
            }
        </> 
    )
}

export default Dashboard