/**
 * Component for aggregating user data. Displays disciplines with lowest & highest scores for the given athlete.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {disciplineScore, skillScore} from '../../libs/calculate'
import './index.styl'

export default class Hints extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleArrayTry: [],
            toggleArrayAvoid: [],
            arrayShouldTry: [],
            arrayShouldAvoid: []
        }
    }

    componentDidMount () {
        this.populateArrays(this.props.disciplines);
    }

    populateArrays(disciplines) {

        //create temporary array to hold objects
        const arrayOfPairs = [];

        //map JSON into objects
        disciplines.map((discipline) => {

            //measure the player's score and package it with the discipline
            let athletesScore =  disciplineScore(this.props.athlete.skillset, discipline.requirements);
            let disciplinePackage = {
                discipline: discipline,
                athleteScore: athletesScore
            };

            //push object to temporary array
            arrayOfPairs.push(disciplinePackage);

        });

        //map the scores in to array
        let tempArray = [];
        arrayOfPairs.map((e) => {
          for (let i = 0; i < this.props.athlete.nativeDisciplines.length; i ++) {
              if (e.discipline.name !== this.props.athlete.nativeDisciplines[i]) {
                  tempArray.push(e.athleteScore);
              }
          }
        });

        //filter repeating scores
        let filteredArray = tempArray.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        });

        filteredArray.sort((a, b) => {
            return b - a
        });

        let maxThird = filteredArray[2];
        let minThird = filteredArray[filteredArray.length -3];

        //get the big one's
        const arrayToRenderAvoid = arrayOfPairs.filter((value) => {
            if (value.athleteScore <= minThird) {
                return value
            }
        });

        //get the small one's
        const arrayToRenderTry = arrayOfPairs.filter((value) => {
            if (value.athleteScore >= maxThird) {
                return value
            }
        });

        const arrayToToggleTry = [];
        const arrayToToggleAvoid = [];

        //generate arrays for toggle functionality
        for (let i = 0; i < arrayToRenderTry.length; i++) {
            arrayToToggleTry.push("none")
        }

        for (let i = 0; i < arrayToRenderAvoid.length; i++) {
            arrayToToggleAvoid.push("none")
        }

        this.setState({
            arrayShouldTry: this.state.arrayShouldTry.concat(arrayToRenderTry),
            toggleArrayTry: this.state.toggleArrayTry.concat(arrayToToggleTry),
            arrayShouldAvoid: this.state.arrayShouldAvoid.concat(arrayToRenderAvoid),
            toggleArrayAvoid: this.state.toggleArrayAvoid.concat(arrayToToggleAvoid),
        });

    }

    //render methods
    renderScoreBreakDown(object) {
        const requirements = object.discipline.requirements;
        const playerSkills = this.props.athlete.skillset;
        return Object.keys(requirements).map((req) => {
            return <li key = {req}>
                {req}: {skillScore(playerSkills[req], requirements[req])}
            </li>
        })
    }

    renderTags(object) {
        return Object.values(object.discipline.tags).map((tag) => {
            return <li key = {tag}>{tag}</li>
        })
    }

    renderCategory(object) {
        const tSport = "Team";
        const iSport = "Individual";
        return <div className="category">
            {object.discipline.isIndividual ? tSport : iSport}
        </div>;
    }

    //id methods
    toggleDiscipline(e, i, toggleArray, setStateName) {
        const clickedArCopy = toggleArray.slice();
        switch (clickedArCopy[i]) {
            case "expand":
                clickedArCopy[i] = "shrink";
                break;
            case "shrink":
                clickedArCopy[i] = "expand";
                break;
            default:
                clickedArCopy[i] = "expand";
        }
        this.setState({
             [setStateName]: clickedArCopy
        });
    }

    renderDisciplines(array, toggleArray, setStateName) {

         const sortedArray = array.sort((a, b) => {

             let scoreA = a.athleteScore;
             let scoreB = b.athleteScore;

             let comparison = 0;
             if (scoreA > scoreB) {
                 comparison = 1;
             } else if (scoreA < scoreB) {
                 comparison = -1;
             }
             return comparison * -1;
         });

        return sortedArray.map((object, i) => {
            return <article key={object.discipline.name} className="c-discipline" id = {toggleArray[i]} onClick={(e) => this.toggleDiscipline(e, i, toggleArray, setStateName)}>
                <div className="discipline-header">
                    <h3 className="name">{object.discipline.name} - {object.athleteScore}</h3>
                    {this.renderCategory(object)}
                    <div className="tags-wrapper">
                        <span className="title-tags">Tags: </span>
                        <ul className="list-tags">
                            {this.renderTags(object)}
                        </ul>
                    </div>
                </div>
                <div className="content-discipline-wrapper">
                    <img className="image-discipline" src={object.discipline.photo} alt={object.discipline.name}/>
                    <div className="breakdown-wrapper">
                        <span className="title-breakdown">Score breakdown:</span>
                        <ul className="list-breakdowns">
                            {this.renderScoreBreakDown(object)}
                        </ul>
                    </div>
                </div>
            </article>
        })
    }

    render() {
        return (
            <section className="l-section c-hints" >
                <h2 className="visuallyhidden" >Hints</h2>
                <div className="content">
                    <section className="should-try">
                        <h3>Should try</h3>
                        {this.renderDisciplines(this.state.arrayShouldTry, this.state.toggleArrayTry, "toggleArrayTry")}
                    </section>
                    <section className="should-try">
                        <h3>Should avoid</h3>
                        {this.renderDisciplines(this.state.arrayShouldAvoid, this.state.toggleArrayAvoid, "toggleArrayAvoid")}
                    </section>
                </div>
            </section>
        )
    }
}

Hints.propTypes = {
    athlete: PropTypes.shape({
        name: PropTypes.string.isRequired,
        photo: PropTypes.string.isRequired,
        bio: PropTypes.string.isRequired,
        skillset: PropTypes.objectOf(PropTypes.number).isRequired,
        nativeDisciplines: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
    disciplines: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        photo: PropTypes.string.isRequired,
        isIndividual: PropTypes.bool.isRequired,
        tags: PropTypes.arrayOf(PropTypes.string).isRequired,
        requirements: PropTypes.objectOf(PropTypes.number).isRequired,
    })).isRequired
};