import { instance } from "../util/instance";
import { useEffect, useState } from "react";
import { confirmAlert } from "../util/SweetAlert2/ConfirmAlert/ConfirmAlert";


const useCheckInputValueApi = () => {
  const [errorData, setErrorData] = useState({
    isError: false,
    errorField: "",
    errorName: "",
    errorMessage: "",
    error: null,
  })

  useEffect(() => {
    if (errorData.isError) {
      confirmAlert(errorData.errorMessage);
    }
  }, [errorData])


  const duplicatedCheckValue = async (fieldName, value, setComplete) => {
    let getResponse;

    try {
      getResponse = await instance.get(`/user/duplicated/${fieldName}?value=${value}`);
      if (getResponse.status === 200) {
        confirmAlert("중복 확인 완료");
        setComplete((checkValue) => ({
          ...checkValue,
          [fieldName]: true
        }))
      }
    } catch (e) {
      console.log("중복!!!")
      setErrorData(errorData => ({
        ...errorData,
        isError: true,
        errorField: fieldName,
        errorName: `${fieldName}중복`,
        errorMessage: e.response.data.errorMessage,
      }));
    }
  };

  return {
    duplicatedCheckValue,
    errorData
  }
};

export default useCheckInputValueApi;