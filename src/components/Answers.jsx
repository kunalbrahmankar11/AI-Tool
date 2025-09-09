import { Children, useEffect, useState } from "react";
import { checkHeading, replaceHeadingStarts } from "../helper";
import SyntaxHighlighter from "react-syntax-highlighter";
import ReactMarkdown from 'react-markdown'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Answer = ({ ans, key }) => {
    const [heading, setHeading] = useState(false);
    const [answer,setAnswer] = useState(ans);


    useEffect(() => {
        if (checkHeading(ans)) {
            setHeading(true);
            setAnswer(replaceHeadingStarts(ans))
        }

    }, [])

   const renderer ={
    code({node,inline,className,children,...props}){
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match?(
            <SyntaxHighlighter 
            {...props}
            children={String(children).replace(/\n$/,'')}
            language={match[1]}
            style={dark}
            PreTag="div"

            
            />
          ):(
            <code {...props} className={className}>
                {children}
            </code>
          )

    }
   }

    return (
        <>
            {heading?<span className="pt-2 text-lg block">{answer}</span>:
            <span className="pl-5">
                <ReactMarkdown components={renderer}>{answer}</ReactMarkdown>
                </span>}
        </>
    )
}
export default Answer;