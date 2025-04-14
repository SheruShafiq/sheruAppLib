import { useState, useEffect } from "react";

export function useMaximumRenderableSkeletonComments() {
    const [maxComments, setMaxComments] = useState<number | null>(null);

    const calculateMaxComments = () => {
        const postElement = document.querySelector(".postPageCommentsTitle");
        const footerElement = document.querySelector(".footer");
        if (postElement && footerElement) {
            const postBottom = postElement.getBoundingClientRect().bottom;
            const footerTop = footerElement.getBoundingClientRect().top;
            const availableHeight = footerTop - postBottom;
            return Math.max(0, Math.floor(availableHeight / 180));
        }
        return null;
    };

    useEffect(() => {
        const updateComments = () => {
            setMaxComments(calculateMaxComments());
        };

        updateComments();
        window.addEventListener("resize", updateComments);
        return () => window.removeEventListener("resize", updateComments);
    }, []);

    return maxComments;
}
