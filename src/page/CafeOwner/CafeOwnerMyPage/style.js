import { css } from "@emotion/react";

export const layout = css`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    background-color: #191919;
    border-radius: 20px;
    & p {
        color:#747474;
        margin: 0;
        font-weight: 700;
    }
`;

export const profileBox = css`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 225px;
    border-bottom: 3px solid #ff675b;
    background-color: #ffffff;
`;

export const menuContainer = css`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    width: 100%;
    padding: 0 20px 100px 20px;
    overflow-y: auto;
    background-color: #ffffff;
`;

export const menu = css`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 0 10px;
    width: 100%;
    height: 100%;
    border-bottom: 1px solid #ff675b;
    cursor: pointer;
    
    svg {
        margin-right: 10px;
        width: 25px;
        height: 25px;
    }

    p:nth-of-type(1) {
        margin-right: 20px;
        font-size: 16px;
        color: black;
        font-weight: 500;
    }

    p:nth-of-type(2) {
        font-size: 16px;
        color: #ff675b;
        font-weight: 500;
    }
    
`;

export const memberButton = css`
    display: flex;
    padding-left: 0;
`



export const modalStyles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // 어두운 반투명 배경
    },
    content: {
        background: 'white', // 모달 내부 배경색
        boxSizing: 'border-box',
        transform: 'translate(-50%, -50%)',
        borderRadius: '20px',
        border: '2px solid #cacaca',
        boxShadow: '0px 0px 10px 4px #00000036',
        top: '50%',
        left: '50%',
        padding: '10px',
        width: '600px',
        height: '750px',
        overflow: 'hidden',
    },
};

export const closeButton = css`
    padding: 5px 20px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 10px;
    border-radius: 20px;
    border: 1px solid #1c1c1b;
`;