const auth = {
	Authorization: "Authorization",
	Bearer: `Bearer ${localStorage.getItem("@jwt")}`
};
// console.log("Retrieved JWT Token:", localStorage.getItem("@jwt"));

export const AUTHORIZATION = auth;
