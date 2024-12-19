import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { validateUserID } from './validateUserID';

interface Props {
  children: JSX.Element;
}

const ValidateUserRoute: React.FC<Props> = ({ children }) => {
  const { userID } = useParams<{ userID: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserID = async () => {
      if (userID && (await validateUserID(userID))) {
        setIsLoading(false); // UserID is valid
      } else {
        navigate('/login'); // Redirect to login if invalid
      }
    };
    checkUserID();
  }, [userID, navigate]);

  return children;
};

export default ValidateUserRoute;
