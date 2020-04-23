require("index.html");
require("stylesheets/style.scss");
require("_config.yaml")

import React from "react";
import ReactDOM from "react-dom";
import App from "app";

ReactDOM.render(
	<App />,
	document.getElementById("app")
);
