import React, { Component } from "react";
import Avatar from "@material-ui/core/Avatar";

class PersonIcon extends Component {
    render() {
        let initals;
        const { name } = this.props;
        if (name) {
            if (name.length > 1) {
                initals = name[0];
                if (name.length > 1) {
                    initals += name[1];
                }
            }
        }

        return (
            <div className="person-icon">
                <Avatar className="icon">{initals}</Avatar>
            </div>
        );
    }
}

export default PersonIcon;
