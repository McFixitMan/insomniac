
// https://stackoverflow.com/a/63891494/3253311

/**
 * Use this in place of a string property name whenever possible
 * 
 * Even with keyof constraints, strings will not be updated when property names are refactored/renamed
 * @returns Object with property names
 */
export const fields = <T>(): { [P in keyof T]: P } => {
    return new Proxy(
        {},
        {
            get: function (_target, prop, _receiver) {
                return prop;
            },
        }
    ) as { [P in keyof T]: P; };
};