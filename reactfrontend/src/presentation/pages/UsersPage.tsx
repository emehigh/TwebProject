import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Fragment, memo } from "react";
import { Box } from "@mui/system";
import { Seo } from "@presentation/components/ui/Seo";
import { ContentCard } from "@presentation/components/ui/ContentCard";
import { UserTable } from "@presentation/components/ui/Tables/UserTable";
import { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; // Import jwtDecode for decoding JWT tokens
export const UsersPage = memo(() => {
  const [username, setUsername] = useState<string | null>(null); // Manage username state here

   // Fetch the logged-in user's username on app load
   useEffect(() => {
     const token = localStorage.getItem("token");
     const decodedToken: any = token ? jwtDecode(token) : null;
     const email = decodedToken ? decodedToken.sub : null;
 
     if (token && email) {
       fetch(`http://localhost:8090/api/v1/me?email=${email}`, {
         method: "GET",
         headers: {
           Authorization: `Bearer ${token}`,
         },
       })
         .then((response) => {
           if (!response.ok) {
             throw new Error("Failed to fetch user details");
           }
           return response.json();
         })
         .then((data) => {
           setUsername(data.username);
         })
         .catch((error) => {
           console.error("Error fetching user details:", error);
         });
     }
   }, []);

  return <Fragment>
    <Seo title="MobyLab Web App | Users" />
    <WebsiteLayout user={null} setUser={() => {}}>
      <Box sx={{ padding: "0px 50px 00px 50px", justifyItems: "center" }}>
        <ContentCard>
          <UserTable />
        </ContentCard>
      </Box>
    </WebsiteLayout>
  </Fragment>
});
