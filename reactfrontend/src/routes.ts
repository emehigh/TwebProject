/**
 * Here you can add more routes as constant to be used for routing within the application.
 */
export enum AppRoute {
    Index = "/",
    Login = "/login",
    Users = "/users",
    Register = "/register",
    Profile = "/profile/:id",
    Feed = "/feed",
    Notifications = "/notifications",
    UserProfile = "/user-profile/:id",
    
    Posts = "/posts",
    PostDetails = "/posts/:id",
    UserFiles = "/user-files"
}
