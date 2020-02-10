import  { useState, useEffect } from "react";

export const useFetch = (url) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    useEffect(() => {
     let mounted = true;
     setLoading(true)
      fetch(url)
        .then(res => res.json())
        .then(result => {
          if (mounted) {
            setData(result);
            setLoading(false);
          }
        });
      return () => {
        mounted = false;
      };
    }, [url]);
    return {loading, data}
}