import { useEffect, useState } from "react"

const ProgressBar = (progress) => {
    const [currentProgress, setCurrentProgress] = useState(progress);

    useEffect(() => {
        setCurrentProgress(progress)
    }, [progress])

    return (
        <div className="progress" role="progressbar" aria-label="Animated striped" aria-valuenow={currentProgress.progress} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-bar progress-bar-striped progress-bar-animated"
                style={{ 
                    width:`${currentProgress.progress}%`
                }}
            ></div>
        </div>
    )
}

export default ProgressBar