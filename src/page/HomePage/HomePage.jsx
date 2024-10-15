import React from 'react';
import Header from '../../components/Header/Header';
/** @jsxImportSource @emotion/react */
import * as s from "./style";

function HomePage({children}) {
    return (
        <div css={s.layout}>
            {children}
        </div>
    );
}

export default HomePage;