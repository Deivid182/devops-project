export const cookies = {


  /**
   * @returns {import('express').CookieOptions}
   */
  getOptions: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  }),

  /**
   * 
   * @param {import('express').Response} res 
   * @param {string} name 
   * @param {string} value 
   * @param {import('express').CookieOptions} options
   */
  set: (res, name, value, options) => {
    res.cookie(name, value, { ...cookies.getOptions(), ...options });
  },


  /**
   * 
   * @param {import('express').Response} res 
   * @param {string} name 
   * @param {import('express').CookieOptions} options
   */
  clear: (res, name, options) => {
    res.clearCookie(name, { ...cookies.getOptions(), ...options });
  },

  /**
   * 
   * @param {import('express').Request} req 
   * @param {string} name 
   */

  get: (req, name) => req.cookies[name],
};