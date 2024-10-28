import React, { useEffect, useRef, useState } from 'react';
/** @jsxImportSource @emotion/react */
import * as s from "./style";
import { useLocation, useNavigate } from 'react-router-dom';
import StarRating from '../../../components/StarRating/StarRating';
import { adjustTextareaHeight } from '../../../apis/util/textAreaUtil';
import { useMutation } from 'react-query';
import { instance } from '../../../apis/util/instance';
import BackButton from '../../../components/BackButton/BackButton';

const categories = [
    { value: 'interior', label: '인테리어가 멋져요' },
    { value: 'music', label: '음악이 좋아요' },
    { value: 'view', label: '뷰가 좋아요' },
    { value: 'photo', label: '사진이 잘 나와요' },
    { value: 'concentrate', label: '집중하기 좋아요' },
    { value: 'parking', label: '주차하기 편해요' },
    { value: 'pet', label: '반려동물과 가기 좋아요' },
    { value: 'children', label: '아이와 가기 좋아요' },
];

function CafeReviewModifyPage(props) {
    const navigate = useNavigate();
    const location = useLocation();
    const { reviewId, reviewItem, cafeDetail } = location.state || {};
    const textareaRef = useRef(null);
    const [isClick, setisClick] = useState([false, false, false, false, false]);
    const [score, setScore] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [reviewData, setReviewData] = useState({
        reviewId: reviewId,
        rating: score,
        category: "",
        review: ""
    });

    useEffect(() => {
        setScore(reviewItem.rating);
        setSelectedCategory(reviewItem.category);
        setReviewData({
            reviewId: reviewId,
            rating: reviewItem.rating,
            category: reviewItem.category,
            review: reviewItem.review
        });
    }, [reviewItem]);

    useEffect(() => {
        adjustTextareaHeight(textareaRef.current);
    }, []);

    useEffect(() => {
        setReviewData(review => ({
            ...review,
            rating: score
        }));
    }, [score]);

    const handleTextareaChange = (e) => {
        adjustTextareaHeight(textareaRef.current);
        setReviewData(review => ({
            ...review,
            [e.target.name]: e.target.value
        }))
    };

    const handleCategoryOnClick = (e) => {
        const category = e.target.value;
        if (selectedCategory === category) {
            setSelectedCategory("");
            setReviewData(prevData => ({
                ...prevData,
                category: ""
            }));
        } else {
            setSelectedCategory(category);
            setReviewData(prevData => ({
                ...prevData,
                category: category
            }));
        }
    };

    const reviewModifyMutation = useMutation(
        async () => {
            return await instance.put(`/review/${reviewId}`, reviewData);
        },
        {
            onSuccess: response => {
                alert("리뷰가 수정되었습니다");
                navigate(`/cafe/detail/${cafeDetail?.id}`, { state: { cafeDetail } });
            }
        }
    )

    const handleSubmitOnClick = async () => {
        if (!reviewData.rating) {
            alert("평점을 남겨주세요.");
            return;
        } else if (!reviewData.category) {
            alert("카테고리를 선택해주세요.");
            return;
        } else if (reviewData.review.trim("") === "") {
            alert("후기를 작성해주세요.");
            return;
        }
        reviewModifyMutation.mutateAsync();
    }

    return (
        <div css={s.layout}>
            <BackButton prevPage={cafeDetail?.cafeName} prevPageUrl={`/cafe/detail/${cafeDetail?.id}`} />
            <div css={s.rating}>
                <h1>{cafeDetail?.cafeName}</h1>
                <StarRating
                    score={score}
                    setScore={setScore}
                    isClick={isClick}
                    setisClick={setisClick} />
            </div>
            <div css={s.category}>
                <h1>어떤 점이 좋았나요?</h1>
                <div css={s.buttons}>
                    {categories.map(category => (
                        <button
                            key={category.value}
                            onClick={handleCategoryOnClick}
                            value={category.value}
                            css={selectedCategory === category.value ? s.activeButton : null}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>
            </div>
            <div css={s.review}>
                <h2>후기를 작성해 보세요!</h2>
                <div css={s.textarea}>
                    <textarea
                        name="review"
                        value={reviewData.review}
                        ref={textareaRef}
                        onChange={handleTextareaChange}
                        placeholder='유용한 팁을 알려주세요! 작성한 내용은 마이페이지 카페 상세페이지에 노출 됩니다.'>
                    </textarea>
                </div>
                <button onClick={handleSubmitOnClick}>수정 완료</button>
            </div>
        </div>
    );
}

export default CafeReviewModifyPage;