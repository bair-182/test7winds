import React, { FunctionComponent, ReactElement } from "react";


interface ILayoutProps {
	children: ReactElement;
}

const Layout: FunctionComponent<ILayoutProps> = ({ children }) => {
	return (
		<div className="wrapper">
     	{children}
    </div>
	)
}

export default Layout;
