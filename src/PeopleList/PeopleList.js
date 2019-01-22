import React, { Component } from "react";
import "./PeopleList.scss";
import Person from "../Person/Person";

class PeopleList extends Component {
    render() {
        let people = this.props.people;

        return (
            <div className="people">
                <h2>People</h2>
                {people.map((person, key) => {
                    return <Person person={person} key={key} />;
                })}
            </div>
        );
    }
}

export default PeopleList;
