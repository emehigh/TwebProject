import { UserRoleEnum } from "@infrastructure/apis/client";
import { useOwnUserHasRole } from "@infrastructure/hooks/useOwnUser";
import { AppIntlProvider } from "@presentation/components/ui/AppIntlProvider";
import { ToastNotifier } from "@presentation/components/ui/ToastNotifier";
import { HomePage } from "@presentation/pages/HomePage";
import { LoginPage } from "@presentation/pages/LoginPage";
import { RegisterPage } from "@presentation/pages/RegisterPage";
import { UserFilesPage } from "@presentation/pages/UserFilesPage";
import { UsersPage } from "@presentation/pages/UsersPage";
import { Route, Routes } from "react-router-dom";
import { AppRoute } from "routes";
import { FeedPage } from "@presentation/pages/FeedPage";
import { ProfilePage } from "@presentation/pages/ProfilePage";
import { WebsiteLayout } from "@presentation/layouts/WebsiteLayout";
import { FeedbackPage } from "@presentation/pages/FeedbackPage"; // Import FeedbackPage component
import { useState, useEffect } from "react";
import { NotificationPage } from "@presentation/pages/NotificationPage"; // Import NotificationPage component
import PostPage from "@presentation/pages/PostPage"; // Import PostPage component
import { jwtDecode } from "jwt-decode"; // Import jwtDecode for decoding JWT tokens
import {AdminConsole} from "@presentation/pages/AdminConsole"; // Import AdminConsole component

export function App() {
  const isAdmin = useOwnUserHasRole(UserRoleEnum.Admin);
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

  return (
    <AppIntlProvider>
      <ToastNotifier />
      <WebsiteLayout user={username} setUser={setUsername}>
        <Routes>
          <Route path={AppRoute.Index} element={<HomePage />} />
          <Route path={AppRoute.Login} element={<LoginPage username={username} />} />

          <Route path="/register" element={<RegisterPage />} />
          <Route path={AppRoute.Feed} element={<FeedPage username={username} />} />
          <Route path={AppRoute.Profile} element={<ProfilePage user={username} setUser={setUsername} />} />
          <Route path="/posts/:id" element={<PostPage username={username}/>} /> {/* Updated route */}
          <Route path={'/feedback'} element={<FeedbackPage username={username || ''}/>} /> {/* Updated route */}
          <Route path={AppRoute.Notifications} element={<NotificationPage username={username} />} /> {/* Updated route */}
          <Route path="/Dashboard" element={<AdminConsole />} /> {/* Updated route */}
          {isAdmin && <Route path={AppRoute.Users} element={<UsersPage />} />}
          {isAdmin && <Route path={AppRoute.UserFiles} element={<UserFilesPage />} />}
        </Routes>
      </WebsiteLayout>
    </AppIntlProvider>
  );
}