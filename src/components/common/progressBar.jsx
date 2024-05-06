import { useEffect, useState } from "react";
import '../../styles/progressBar.scss';

const ProgressBar = (progress) => {
    const [currentProgress, setCurrentProgress] = useState(0);

    useEffect(() => {
        setCurrentProgress(progress)
    }, [progress])

    return (
        
        <div className="progress-container">
            <div className="indicators flex justify-between">
                <span className="text roboto-medium">
                    Procesando datos
                </span>
                <span className="progress-value roboto-medium">
                    {currentProgress.progress}%
                </span>
            </div>
            <div className="progress" role="progressbar" aria-label="Danger  simple" aria-valuenow={currentProgress.progress} aria-valuemin="0" aria-valuemax="100">
                <div className="progress-bar bg-danger"
                    style={{ 
                        width:`${currentProgress.progress}%`
                    }}
                ></div>
            </div>
        </div>
        
    )
}

export default ProgressBar