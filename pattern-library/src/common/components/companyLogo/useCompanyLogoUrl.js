import { useState, useEffect } from "react";
import { API_BASE_URL } from "common/utility/api";

const useCompanyLogoUrl = () => {
  const [companyLogoUrl, setCompanyLogoUrl] = useState(null);

  useEffect(() => {
    const generateCompanyLogoUrl = () => {
      try {
        const baseApiUrl = API_BASE_URL.replace(/\/api(?!.*\/api)/, "");

        const companyLogoPath = sessionStorage.getItem("companyLogoPath");

        if (companyLogoPath) {
          const adjustedRelativePath = companyLogoPath
            .replace(/\\/g, "/")
            .replace("wwwroot/", "");

          const url = `${baseApiUrl}/${adjustedRelativePath}`;
          setCompanyLogoUrl(url);
        } else {
          setCompanyLogoUrl(null);
        }
      } catch (error) {
        console.error("Error generating company logo url:", error);
        setCompanyLogoUrl(null);
      }
    };

    generateCompanyLogoUrl();
  }, []);

  return companyLogoUrl;
};

export default useCompanyLogoUrl;
