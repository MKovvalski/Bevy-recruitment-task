/**
 * Component for displaying basic info about the provided athlete.
 */

import React from 'react'
import PropTypes from 'prop-types'
import './index.styl'

export default class Overview extends React.Component {

    displaySkills(skillset) {

        //get the max/min skill levels of the player
        const skillLevels = Object.values(skillset);
        const max = Math.max.apply(null, skillLevels);
        const min = Math.min.apply(null, skillLevels);

        //render the skills with images
        return Object.keys(skillset).map((skill) => {

            //filter best/worst skills of player and mark them
            let underline = "";
            if (skillset[skill] === max) {
                underline = "border-green"
            }
            if (skillset[skill] === min) {
                underline = "border-red"
            }
            return (
                <li className="skill" key={skill} id = {underline}>
                    <img className="list-img" src={"assets/" + skill + ".png"} alt={skill}/>
                    <div className="skill-level">{this.props.skillset[skill]}</div>
                </li>
            )
        })
    }

    render() {
        return (
            <section className="l-section c-overview" >
                <h2 className="visuallyhidden" >Overview</h2>
                <div className="content"> 
                    <span className="label">Bio</span>
                    <p className="bio">{this.props.bio}</p>
                    <span className="label">Skillset</span>
                    <ul className="skillset">
                        {this.displaySkills(this.props.skillset)}
                    </ul>
                </div>
            </section>
        )
    }
}

Overview.propTypes = {
    name: PropTypes.string.isRequired,
    photo: PropTypes.string.isRequired,
    bio: PropTypes.string.isRequired,
    skillset: PropTypes.objectOf(PropTypes.number).isRequired,
    nativeDisciplines: PropTypes.arrayOf(PropTypes.string).isRequired,
};