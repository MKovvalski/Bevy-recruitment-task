/**
 * Component responsible for Home page layout.
 */

import React from 'react'
import PropTypes from 'prop-types'
import Profile from '../../components/Profile'
import Overview from '../../components/Overview'
import Predictions from '../../components/Predictions'
import Hints from '../../components/Hints'

import './index.styl'

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            athleteIndex: 0,
            tabIndex: 0,
            arrayToToggle: ["enlarge", "none", "none"],
            arrayOfTabs: ["Overview", "Predictions", "Hints"]
        }
    }

    switchAthletes(direction) {
      switch (direction) {
          case "next":
              if (this.state.athleteIndex === 3) {
                  this.setState ({
                      athleteIndex: 0
                  })
              } else {
                  this.setState ({
                      athleteIndex: this.state.athleteIndex + 1
                  })
              }
              break;
          case "prev":
              if (this.state.athleteIndex === 0) {
                  this.setState ({
                      athleteIndex: 3
                  })
              } else {
                  this.setState ({
                      athleteIndex: this.state.athleteIndex - 1
                  })
              }
              break;
          default:
              return null
      }
      this.setState({
          tabIndex: 0,
          arrayToToggle: ["enlarge", "none", "none"]
      })
    };

    switchTabs(tabTitle) {
        switch (tabTitle) {
            case "Overview":
                this.setState({
                    tabIndex: 0
                });
                break;
            case "Predictions":
                this.setState({
                    tabIndex: 1
                });
                break;
            case "Hints":
                this.setState({
                    tabIndex: 2
                });
                break;
            default:
                this.setState({
                    tabIndex: 0
                });
        }
    }

    toggleId(e, i) {
        const clickedArCopy = this.state.arrayToToggle.slice();
        let temporaryArray = clickedArCopy.map((element, index) => {
            if (index === i) {
                return "enlarge"
            } else {
                return "none"
            }
        });
        this.setState({
           arrayToToggle: temporaryArray
        })

    }

    renderTabs(array) {
        return array.map((e, i) => {
            return <li className="tab-list-element" key={e} onClick={(e) => this.toggleId(e, i)}>
                <a className="tab-link" id = {this.state.arrayToToggle[i]} onClick={() => this.switchTabs(e)} href="#">{e}</a>
            </li>
        })
    }

    displayTab(tabIndex, athlete, disciplines) {
        switch (tabIndex) {
            case 0:
                return <Overview {...athlete} />;
            break;
            case 1:
                return <Predictions athlete={athlete} disciplines={disciplines} />;
            break;
            case 2:
                return <Hints athlete={athlete} disciplines={disciplines} />;
            break;
            default:
                return <Overview {...athlete} />;
        }
    }

    render() {
        const athlete = this.props.athletes ? this.props.athletes[this.state.athleteIndex] : null;
        const disciplines = this.props.disciplines ? this.props.disciplines : [];
        if (athlete)
            return (
                <div className="p-home">
                    <button onClick={() => this.switchAthletes("prev")} className="button-prev"><div className="button-inside-prev"><span className="visuallyhidden">previous</span></div></button>
                    <button onClick={() => this.switchAthletes("next")} className="button-next"><div className="button-inside-next"><span className="visuallyhidden">next</span></div></button>
                    <Profile {...athlete} />
                    <ul className="list-tabs">
                        {this.renderTabs(this.state.arrayOfTabs)}
                    </ul>
                    {this.displayTab(this.state.tabIndex, athlete, disciplines)}
                </div>
            );
        else 
            return <span>No athlete data</span>
    } 
}

Home.propTypes = {
    athletes: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        photo: PropTypes.string.isRequired,
        bio: PropTypes.string.isRequired,
        skillset: PropTypes.objectOf(PropTypes.number).isRequired,
        nativeDisciplines: PropTypes.arrayOf(PropTypes.string).isRequired,
    })).isRequired,
    disciplines: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        photo: PropTypes.string.isRequired,
        isIndividual: PropTypes.bool.isRequired,
        tags: PropTypes.arrayOf(PropTypes.string).isRequired,
        requirements: PropTypes.objectOf(PropTypes.number).isRequired,
    })).isRequired
}