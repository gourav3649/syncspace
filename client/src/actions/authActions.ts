import { Dispatch,  } from "redux";
import { login, register, getMe } from "../api/api";
import { LoginArgs, RegisterArgs } from "../api/types";
import { showAlert } from "./alertActions";
import { resetChatAction } from "./chatActions";
import { resetFriendsAction } from "./friendActions";
import {actionTypes, CurrentUser} from "./types";
import { unsubscribeUserToPush } from "../notifications";


export const loginUser = (credentials: LoginArgs) => {
    return async (dispatch: Dispatch) => {
        const response = await login(credentials);

        if ("error" in response) {
            dispatch({
                type: actionTypes.authError,
                payload: response.message
            })

            dispatch(showAlert(response.message));
        } else {
            localStorage.setItem("currentUser", JSON.stringify(response.userDetails));
            dispatch({
                type: actionTypes.authenticate,
                payload: response.userDetails
            })

          dispatch(
              showAlert(
                `Hi, ${response.userDetails.username} 👋. Welcome back.`
              )
          );
        }
    }
}



export const registerUser = (credentials: RegisterArgs) => {
    return async (dispatch: Dispatch) => {
        const response = await register(credentials);

        if ("error" in response) {
            dispatch({
                type: actionTypes.authError,
                payload: response.message,
            });

            dispatch(showAlert(response.message));
        } else {
            localStorage.setItem(
                "currentUser",
                JSON.stringify(response.userDetails)
            );
            dispatch({
                type: actionTypes.authenticate,
                payload: response.userDetails,
            });

            dispatch(
                showAlert(
                    `Hi 👋 ${response.userDetails.username}. Welcome to SyncSpace. I'm Saalik, the creator. You have me as a friend until you invite and add your other friends 😊.`
                )
            );
        }
    };
};


export const autoLogin = () => {
    return async (dispatch: Dispatch) => {

        // Initial state is loading: true, so no need to dispatch authLoading here.
        // But we still dispatch to reset any prior error state cleanly.
        dispatch({
            type: actionTypes.authLoading,
            payload: true,
        });

        try {
            const currentUser: CurrentUser = JSON.parse(
                localStorage.getItem("currentUser") || "{}"
            );

            const response = await getMe();

            // token has expired
            if (response.statusCode === 401 || response.statusCode === 403) {
                localStorage.clear();
                dispatch({
                    type: actionTypes.authLoading,
                    payload: false,
                });
            } else {
                if (currentUser.token) {
                    dispatch({
                        type: actionTypes.authenticate,
                        payload: {
                            ...response.me,
                            token: currentUser.token,
                        },
                    });
                } else {
                    // No token in localStorage, clear loading
                    dispatch({
                        type: actionTypes.authLoading,
                        payload: false,
                    });
                }
            }
        } catch (err) {
            // Network error or unexpected failure — clear loading so app doesn't hang
            dispatch({
                type: actionTypes.authLoading,
                payload: false,
            });
        }
    }
}



export const logoutUser = () => {
  return async (dispatch: Dispatch) => {

        unsubscribeUserToPush(() => {
          localStorage.removeItem('currentUser');
        });

        dispatch({
            type: actionTypes.logout,
        });

        dispatch(resetChatAction());
        dispatch(resetFriendsAction());

        dispatch({
            type: actionTypes.resetChat
        })
    }
}