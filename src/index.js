import React from "react";
import ReactDOM from "react-dom";
import App from "./containers/App";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import Firebase, { FirebaseContext } from "./components/Firebase";

import "bootstrap/dist/css/bootstrap.css";
import "./index.scss";
import { CssBaseline } from "@material-ui/core";

const theme = createMuiTheme({
    palette: {
        type: "dark", // Switching the dark mode on is a single property value change.
        background: {
            default: "#000"
        }
    },
    typography: { useNextVariants: true },
    overrides: {
        MuiPaper: {
            root: {
                backgroundColor: "rgba(17, 17, 17, 0.95)"
            }
        },
        MuiCardActionArea: {
            root: {
                backgroundColor: "#151515"
            }
        },
        MuiTypography: {
            h5: {
                color: "#AAAAAA"
            }
        }
    }
});

ReactDOM.render(
    <FirebaseContext.Provider value={new Firebase()}>
        <MuiThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </MuiThemeProvider>
    </FirebaseContext.Provider>,
    document.getElementById("root")
);
