/**
 * Component displaying and managing list of disciplines with calculated athlete score.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {disciplineScore, skillScore} from '../../libs/calculate'
import './index.styl'

export default class Predictions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleArray: [],
            arrayOfObjects: [],
            arrayToRender: [],
            arrayOfTags: [],
            arrayOfTagsSecond: [],
            arrayOfFlags: ["all",false, true],
            arrayOfSorts: ["a-z", "z-a", "lowest score", "highest score"],
            flag: "all",
            filter: "all",
            filterSecond: "all",
            sortBy: "no sorting",
            disciplineId: "",
            tagSecondClass: "tag-inactive",
            secondFilterId: "display-none"
        }
    }

    componentDidMount () {
        this.populateArray(this.props.disciplines);
        this.extractTags(this.props.disciplines);
    }

    //populate methods
    populateArray(disciplines) {

        //create temporary array to hold objects
        const arrayOfPairs = [];

        const toggleArray =[];

        //map JSON into objects
        disciplines.map((discipline) => {

            toggleArray.push("none");

            //measure the player's score and package it with the discipline
            let athletesScore =  disciplineScore(this.props.athlete.skillset, discipline.requirements);
            let disciplinePackage = {
                discipline: discipline,
                athleteScore: athletesScore
            };

            //push object to temporary array
            arrayOfPairs.push(disciplinePackage);
        });

        //push temporary array to state array and array to filter
        this.setState({
            arrayOfObjects: this.state.arrayOfObjects.concat(arrayOfPairs),
            arrayToRender: this.state.arrayToRender.concat(arrayOfPairs),
            toggleArray: this.state.toggleArray.concat(toggleArray)
        });
    }

    extractTags(disciplines) {

        //create temporary array
        const disciplineTags = ["all"];

        //populate temporary array tags from all disciplines
        disciplines.map((discipline) => {
            const tags = discipline.tags;
            disciplineTags.push(...tags);
        });

        //filter overlapping tags - credits to stackoverflow
        let filteredTags = disciplineTags.filter((elem, index, self) => {
            return index === self.indexOf(elem);
        });

        //push temporary array to state array
        this.setState({
            arrayOfTags: this.state.arrayOfTags.concat(filteredTags)
        })
    }

    //filter/sort methods
    filterArray(filter, filter2, flag, sort) {

        //reset render with every filtering
        let array = this.state.arrayOfObjects.slice();
        let temporaryToggleArray = [];

        //filter by tag values
        if (filter !== "all") {
            array = array.filter((value) => {
                if (value.discipline.tags[0] === filter) {
                    return value
                }
            });
        }

        //extract second tags of first filter
        const secondFilterTags = ["all"];

        for (let i = 0; i < array.length; i ++) {
            const tag = array[i].discipline.tags[1];
            if (tag !== undefined) {
                secondFilterTags.push(array[i].discipline.tags[1])
            }
        }

        let filteredTags = secondFilterTags.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        });

        //filter by second tag value
        if (filter2 !== "all") {
            array = array.filter((value) => {
                if (value.discipline.tags[1] === filter2) {
                    return value
                }
            })
        }

        //filter by flag values
        if (flag !== "all") {
            array = array.filter((value) => {
                if (value.discipline.isIndividual === flag) {
                    return value
                }
            });
        }

        //sort by sorting value
        if (sort !== "no sorting") {
            array.sort((a, b) => {

                let nameA = "";
                let nameB = "";
                let direction = 1;

                switch(sort) {
                    case "a-z":
                        nameA = a.discipline.name;
                        nameB = b.discipline.name;
                        direction = 1;
                        break;
                    case "z-a":
                        nameA = a.discipline.name;
                        nameB = b.discipline.name;
                        direction = -1;
                        break;
                    case "highest score":
                        nameA = a.athleteScore;
                        nameB = b.athleteScore;
                        direction = -1;
                        break;
                    case "lowest score":
                        nameA = a.athleteScore;
                        nameB = b.athleteScore;
                        direction = 1;
                        break;
                    default:
                        return null
                }

                let comparison = 0;
                if (nameA > nameB) {
                    comparison = 1;
                } else if (nameA < nameB) {
                    comparison = -1;
                }
                return comparison * direction;
            });
        }

        for (let i = 0; i < array.length; i++) {
            temporaryToggleArray.push("none")
        }

        //set filtered/sorted array to render
        this.setState({

            arrayToRender: array,
            toggleArray: temporaryToggleArray,
            arrayOfTagsSecond: filter !== "all" ? filteredTags : []
        })
    }

    filterBy(filter, state) {
        let resetFilter = "";
        if (state === "filter") {
           resetFilter = "filterSecond"
        }
        this.setState({
            [state]: filter,
            [resetFilter]: "all",
        }, () => {
            this.filterArray(this.state.filter, this.state.filterSecond, this.state.flag, this.state.sortBy);
        });
    }

    //rendering methods
    renderFilters(array, state) {
       return array.map((filter) => {
           return <li key={filter}>
               <button className="button-filters" onMouseLeave={() => this.toggleTagsSecond(this.state.arrayOfTagsSecond)} onClick={() => this.filterBy(filter, state)}>{filter}</button>
           </li>
       })
    }

    renderFlags(array) {
        return array.map((flag) => {
            let textToDisplay = "";
            switch (flag) {
                case false:
                    textToDisplay = "Individual sport";
                    break;
                case true:
                    textToDisplay = "Team sport";
                    break;
                default:
                    textToDisplay = "all";
            }
            return <li key={flag}>
                <button className="button-filters" onClick={() => this.filterBy(flag, "flag")}>{textToDisplay}</button>
            </li>
        })
    }

    renderFlagName() {
        switch (this.state.flag) {
            case false:
                return "Individual";
            break;
            case true:
                return "Team";
                break;
            default:
                return "all"

        }
    }

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

    renderDisciplines(array) {
        if (array.length === 0) {
            return <div>no discipline matches your search</div>
        } else {
            return array.map((object, i) => {
                return <article key={object.discipline.name} className="c-discipline" id = {this.state.toggleArray[i]} onClick={(e) => this.toggleDiscipline(e, i)}>
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

    }

    //reset method
    resetFilters() {
        this.setState({
            flag: "all",
            filter: "all",
            filterSecond: "all",
            sortBy: "no sorting",
            disciplineId: "",
            tagSecondClass: "tag-inactive",
            secondFilterId: "display-none"
        }, () => {
            this.filterArray(this.state.filter, this.state.filterSecond, this.state.flag, this.state.sortBy);
        });
    }

    //id methods
    toggleDiscipline(e, i) {
        const clickedArCopy = this.state.toggleArray.slice();
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
            toggleArray : clickedArCopy
        });
    }

    toggleTagsSecond(array) {
        if (array.length === 0) {
            this.setState({
                secondFilterId: "display-none",
                tagSecondClass: "tag-inactive"
            })
        } else {
            this.setState({
                secondFilterId: "none",
                tagSecondClass: "none"
            })
        }
    }

    render() {
        return (
            <section className="l-section c-predictions" >
                <h2 className="visuallyhidden" >Predictions</h2>
                <h3 className="subtitle-filters">Filter By:</h3>
                <button className="button-reset-filters" onClick={() => {this.resetFilters()}}>reset filters</button>
                <div className="filters-wrapper">
                    <div className="expander-filters">&#8595;<span>Tag 1: </span>{this.state.filter}
                        <ul className="list-filters">
                            {this.renderFilters(this.state.arrayOfTags, "filter")}
                        </ul>
                    </div>
                    <div className="expander-filters">&#8595;<span className={this.state.tagSecondClass}>Tag 2: </span>{this.state.filterSecond}
                        <ul className="list-filters" id = {this.state.secondFilterId}>
                            {this.renderFilters(this.state.arrayOfTagsSecond, "filterSecond")}
                        </ul>
                    </div>
                    <div className="expander-filters">&#8595;<span>Types: </span>{this.renderFlagName()}
                        <ul className="list-filters">
                            {this.renderFlags(this.state.arrayOfFlags)}
                        </ul>
                    </div>
                    <div className="expander-filters addOn-1">&#8595;<span>Order: </span>{this.state.sortBy}
                        <ul className="list-filters">
                            {this.renderFilters(this.state.arrayOfSorts, "sortBy")}
                        </ul>
                    </div>
                </div>
                <div className="content">
                    {this.renderDisciplines(this.state.arrayToRender)}
                </div>
            </section>
        )
    }
}

Predictions.propTypes = {
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