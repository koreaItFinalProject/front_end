/** @jsxImportSource @emotion/react */
import * as s from "./style";
import { useCallback, useMemo, useRef, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageResize from 'quill-image-resize';
import { v4 as uuid } from "uuid";
import { storage } from '../../../firebase/firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useModifyBoardMutation } from '../../../apis/modifyBoardApi';
import { useQueryClient } from 'react-query';
import { RingLoader } from "react-spinners";
import { confirmCancelAlert } from "../../../apis/util/SweetAlert2/ConfirmCancelAlert/ConfirmCancelAlert";
import { instance } from "../../../apis/util/instance";
Quill.register("modules/imageResize", ImageResize);

function BoardModifyPage(props) {
    const params = useParams();
    const location = useLocation();
    const boardId = params.boardId;
    const queryClient = useQueryClient();
    const boardData = queryClient.getQueryData(['boardQuery', boardId]);
    const navigate = useNavigate();
    const quillRef = useRef(null);
    const [isUploading, setUploading] = useState(false);
    const [modifyBoard, setModifyBoard] = useState({
        boardId,
        title: boardData !== undefined ? boardData?.data.title : location.state.title,
        content: boardData !== undefined ? boardData?.data.content : location.state.title,
    });
    const reportId = location?.state?.reportId ? location.state.reportId : 0;

    const modifyBoardMutation = useModifyBoardMutation(navigate);

    const handleModifySubmitOnClick = async () => {
        const selection = await confirmCancelAlert("게시글을 수정 하시겠습니까?");
        console.log(""+boardId);
        if (selection) {
            modifyBoardMutation.mutate({ modifyBoard, boardId });
            if (reportId > 0) {
                await instance.delete(`/message/${reportId}`);
            }
        } else if (selection === false) {
            navigate(`/board/modify/${boardId}`);
        }
    }

    const handleTitleInputOnChange = (e) => {
        setModifyBoard(board => ({
            ...board,
            title: e.target.value,
        }));
    }

    const handleQuillValueOnChange = (value) => {
        setModifyBoard(board => ({
            ...board,
            content: quillRef.current.getEditor().getText().trim() === "" ? "" : value,
        }));
    }

    const handleImageLoad = useCallback(() => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.click();

        input.onchange = () => {
            const editor = quillRef.current.getEditor();
            const files = Array.from(input.files);
            const imgFile = files[0];

            const editPoint = editor.getSelection(true);

            const storageRef = ref(storage, `board/img/${uuid()}_${imgFile.name}`);
            console.log(storageRef);
            const task = uploadBytesResumable(storageRef, imgFile);
            setUploading(true);
            task.on(
                "state_changed",
                () => { },
                () => { },
                async () => {
                    const url = await getDownloadURL(storageRef);
                    editor.insertEmbed(editPoint.index, "image", url);
                    editor.setSelection(editPoint.index + 1);
                    editor.insertText(editPoint.index + 1, "\n");
                    setUploading(false);
                    setModifyBoard(board => ({
                        ...board,
                        content: editor.root.innerHTML
                    }));
                }
            );
        }

    }, []);

    const toolbarOptions = useMemo(() => [
        ['image'],
    ], []);

    return (
        <div css={s.layout}>
            <div css={s.boardHeader}>
                <div css={s.buttonLayout}>
                    <button onClick={() => navigate(`/board/detail/${boardId}`)}>취소</button>
                    <h1>글수정</h1>
                    <button
                        onClick={handleModifySubmitOnClick}
                        disabled={modifyBoard?.title.trim() === '' || modifyBoard?.content.trim() === ""}
                    >
                        수정하기
                    </button>
                </div>
                <input type="text" name='title' onChange={handleTitleInputOnChange} value={modifyBoard?.title} placeholder='제목을 입력하세요.' />
            </div>
            <div css={s.editorLayout}>
                {
                    isUploading &&
                    <div css={s.loadingLayout}>
                        <RingLoader />
                    </div>
                }
                <ReactQuill
                    ref={quillRef}
                    theme='snow'
                    value={modifyBoard.content}
                    onChange={handleQuillValueOnChange}
                    modules={{
                        toolbar: {
                            container: toolbarOptions,
                            handlers: {
                                image: handleImageLoad,
                            }
                        },
                        imageResize: {
                            parchment: Quill.import("parchment")
                        },
                    }}
                />
            </div>

        </div>
    );
}

export default BoardModifyPage;