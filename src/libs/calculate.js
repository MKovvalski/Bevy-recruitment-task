/**
 * Method for calculating score for individual skill
 * @param {number} personalSkill skill value of an athlete
 * @param {number} requirement skill value requirement of a discipline
 */
export const skillScore = (personalSkill, requirement) => {
    return (personalSkill - requirement) * requirement * 2;
};

/**
 * Method for calculating score for an athlete in specific discipline
 * @param {object} athleteSkillset object with an athlete skillset
 * @param {object} disciplineRequirements object with an discipline requirements
 */
export const disciplineScore = (athleteSkillset, disciplineRequirements) => {
    let score = 50;
    for (let skill of Object.keys(athleteSkillset))
        score += skillScore(athleteSkillset[skill], disciplineRequirements[skill]);
    return score;
};
