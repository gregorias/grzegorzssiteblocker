"use strict";

import React from "react";

import { createRoot } from "react-dom/client";

import { OptionsPage } from "./OptionsPage";

const react_list_div = document.getElementById("react-list");
const react_list_root = createRoot(react_list_div);
react_list_root.render(<OptionsPage />);
