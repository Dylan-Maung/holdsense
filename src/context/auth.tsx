import { BASE_URL, TOKEN_KEY_NAME } from "@/lib/constants";
import { AuthError, AuthRequestConfig, DiscoveryDocument, exchangeCodeAsync, makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import * as jose from "jose";
import * as React from "react";
import { Platform } from "react-native";
import { tokenCache } from "../utils/cache";
import { useRouter } from "expo-router";
import { getUserProfile } from "../services/userService";
import { UserProfile } from "../types/userProfile";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/lib/firebaseConfig";

WebBrowser.maybeCompleteAuthSession();

export type AuthUser = {
    sub: string;
    email: string;
    name: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    email_verified?: boolean;
    provider?: string;
    exp?: number;
    cookieExpiration?: number;
    firebase_uid: string;
}

const AuthContext = React.createContext({
    user: null as AuthUser | null,
    profile: null as UserProfile | null,
    setProfile: (profile: UserProfile | null) => {},
    signIn: () => {},
    signOut: () => {},
    setOnboarded: (value: boolean) => {},
    fetchWithAuth: async (url: string, options: RequestInit) => Promise.resolve(new Response()),
    isLoading: false,
    onboarded: false,
    error: null as AuthError | null,
});

const config: AuthRequestConfig = {
    clientId: "google",
    scopes: ["openid", "profile", "email"],
    redirectUri: makeRedirectUri(),
}

const discovery: DiscoveryDocument = {
    authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
    tokenEndpoint: `${BASE_URL}/api/auth/token`,
}

export const AuthProvider = ({ children }: {children: React.ReactNode }) => {
    const [user, setUser] = React.useState<AuthUser | null>(null);
    const [profile, setProfile] = React.useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [onboarded, setOnboarded] = React.useState(false);
    const [error, setError] = React.useState<AuthError | null>(null);
    const [request, response, promptAsync] = useAuthRequest(config, discovery);
    const isWeb = Platform.OS === "web"
    const [accessToken, setAccessToken] = React.useState<string | null>(null);
    const router = useRouter();

    React.useEffect(() => {
        handleResponse();
    }, [response])

    React.useEffect(() => {
        const restoreSession = async() => {
            setIsLoading(true);
            try {
                await new Promise((resolve) => {
                    const unsubscribe = auth.onAuthStateChanged((user) => {
                        unsubscribe();
                        resolve(user);
                    });
                });

                const firebaseUser = auth.currentUser;

                if (isWeb) {
                    const sessionRestoreResponse = await fetch(`${BASE_URL}/api/auth/session`, {
                        method: 'GET',
                        credentials: "include"
                    });

                    if (sessionRestoreResponse.ok) {
                        const userData = await sessionRestoreResponse.json() as AuthUser;
                        const updatedUser: AuthUser = {
                            ...userData,
                            firebase_uid: firebaseUser?.uid || userData.firebase_uid,
                        };
                        setUser(updatedUser);
                        
                        const profile = await getUserProfile(updatedUser.firebase_uid);
                        setOnboarded(!!profile);
                        setProfile(profile);
                    }
                } else {
                    // Native (mobile)
                    const storedAccessToken = await tokenCache?.getToken(TOKEN_KEY_NAME);

                    await new Promise((resolve) => {
                        const unsubscribe = auth.onAuthStateChanged((user) => {
                            unsubscribe();
                            resolve(user);
                        });
                    });
                    
                    const firebaseUser = auth.currentUser;
                    
                    if (storedAccessToken) {
                        try {
                            const decoded = jose.decodeJwt(storedAccessToken) as AuthUser;
                            setAccessToken(storedAccessToken);
                            const updatedUser: AuthUser = {
                                ...decoded,
                                firebase_uid: firebaseUser?.uid || decoded.firebase_uid,
                            };
                            setUser(updatedUser);

                            const profile = await getUserProfile(updatedUser.firebase_uid);
                            setOnboarded(!!profile);
                            setProfile(profile);
                        } catch (e) {
                            console.log(e);
                        }
                    } else {
                        console.log("user not authenticated");
                    }
                }
            } catch (e) {
                console.log(e)
            } finally {
                setIsLoading(false);
            }
        }
        restoreSession();
    }, [isWeb])

    const handleResponse = async () => {
        if (response?.type === "success") {
            const { code } = response.params;

            try {
                setIsLoading(true);

                const tokenResponse = await exchangeCodeAsync(
                    {
                        code: code,
                        extraParams: {
                            platform: Platform.OS
                        },
                        clientId: "google",
                        redirectUri: makeRedirectUri(),
                    },
                    discovery
                );

                if (isWeb) {
                    const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
                        method: "GET",
                        credentials: "include",
                    });

                    if (sessionResponse.ok) {
                        // Set Firebase credentials:
                        const idToken = tokenResponse.idToken;
                        const credential = GoogleAuthProvider.credential(idToken);
                        const firebaseUserCredential = await signInWithCredential(auth, credential);
                        const firebaseUser = firebaseUserCredential.user;

                        const sessionData = await sessionResponse.json() as AuthUser;

                        const userData: AuthUser = {
                            ...sessionData,
                            firebase_uid: firebaseUser.uid,
                        };
                        setUser(userData);

                        let profile = await getUserProfile(firebaseUser.uid);
                        setProfile(profile);

                        // Onboarding first time user
                        if (!profile) {
                            console.log("New User")
                            setOnboarded(false);
                        } else {
                            setOnboarded(true);
                        }
                    } else {
                        router.replace('/login');
                    }
                } else {
                    // Native (mobile)
                    const accessToken = tokenResponse.accessToken;
                    const idToken = tokenResponse.idToken;

                    // Set Firebase credentials:
                    const credential = GoogleAuthProvider.credential(idToken);
                    const firebaseUserCredential = await signInWithCredential(auth, credential);
                    const firebaseUser = firebaseUserCredential.user;

                    setAccessToken(accessToken);
                    tokenCache?.saveToken(TOKEN_KEY_NAME, accessToken);

                    const decoded = jose.decodeJwt(accessToken) as AuthUser;
                    const userData: AuthUser = {
                        ... decoded,
                        firebase_uid: firebaseUser.uid,
                    };
                    setUser(userData);

                    let profile = await getUserProfile(firebaseUser.uid);
                    setProfile(profile);

                    if (!profile) {
                        console.log("New User - mobile");
                        setOnboarded(false);
                    } else {
                        setOnboarded(true);
                    }
                }
            } catch(e) {
                console.log(e)
            } finally {
                setIsLoading(false);
            }
            //console.log(code);
        } else if (response?.type === "error") {
            setError(response.error as AuthError)
        }
    }

    const signIn = async () => {
        try {
           if (!request) {
            console.log("no request");
            return;
           }

           await promptAsync();
        } catch(e){
            console.log(e);
        }
    };

    const signOut = async () => {
        if (isWeb) {
            try {
                await fetch(`${BASE_URL}/api/auth/logout`, {
                    method: "POST",
                    credentials: "include",
                });
            } catch (e) {
                console.error("Error during web logout: ", e)
            }
        } else {
            await tokenCache?.deleteToken(TOKEN_KEY_NAME);
        }

        await auth.signOut();

        setUser(null);
        setProfile(null);
        setOnboarded(false);
        router.replace('/login')
    };

    const fetchWithAuth = async (url: string, options: RequestInit) => {
        if (isWeb) {
            const response = await fetch(url, {
                ...options,
                credentials: "include",
            });

            // if (response.status === 401) {
            //     console.log("API request failed with 401")

            //     //Can refresh token or log user out:
            //     refreshAccessToken();

            //     if (user) {
            //         return fetch(url, {
            //             ...options,
            //             credentials: "include",
            //         });
            //     }
            // }
            return response;
        } else {
            // Native (mobile)
            const response = await fetch(url, {
                ...options,
                headers: {
                    ...options.headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            // If response 401 can refresh token

            return response;
        }
    };

    return (
        <AuthContext.Provider 
            value={{
                user,
                profile,
                setProfile,
                signIn,
                signOut,
                setOnboarded,
                fetchWithAuth,
                isLoading,
                onboarded,
                error,
             }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}