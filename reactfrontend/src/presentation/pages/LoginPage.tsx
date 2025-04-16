import { WebsiteLayout } from "presentation/layouts/WebsiteLayout";
import { Fragment, memo } from "react";
import { Box } from "@mui/material";
import { Seo } from "@presentation/components/ui/Seo";
import { LoginForm } from "@presentation/components/forms/Login/LoginForm";
interface FeedPageProps {
    username: string | null;
}

export const LoginPage =  memo(({ username }: FeedPageProps) => {
    return <Fragment>
        <Seo title="MobyLab Web App | Login" />
        <WebsiteLayout user={null} setUser={() => {}}>
            <Box sx={{ padding: "0px 50px 0px 50px", justifyItems: "center" }}>
                <LoginForm />
            </Box>
        </WebsiteLayout>
    </Fragment>
});
