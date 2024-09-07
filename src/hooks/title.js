const { useEffect } = require("react");

export default function useTitle(title) {
    useEffect(() => {
        document.title = `${title} | ${process.env.REACT_APP_NAME}`
    })
}