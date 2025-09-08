import { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStarts } from "../helper";

const Answer = ({ ans, key }) => {
    const [heading, setHeading] = useState(false);
    const [answer,setAnswer] = useState(ans);


    useEffect(() => {
        if (checkHeading(ans)) {
            setHeading(true);
            setAnswer(replaceHeadingStarts(ans))
        }

    }, [])

   

    return (
        <>
            {heading?<span className="pt-2 text-lg block">{answer}</span>:
            <span className="pl-5">{answer}</span>}
        </>
    )
}
export default Answer;