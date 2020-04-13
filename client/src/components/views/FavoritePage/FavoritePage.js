import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import './favorite.css';
import { Popover, Button } from 'antd';
import { IMAGE_URL } from '../../Config';

function FavoritePage() {

    const [Favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchFavoredMovie();
    }, [])

    const fetchFavoredMovie = () => {
        Axios.post('/api/favorite/getFavoredMovie', { userFrom: localStorage.getItem('userId') })
        .then(response => {
            if(response.data.success) {
                setFavorites(response.data.favorites);
            } else {
                alert('映画情報の取得を失敗しました。');
            }
        })
    }

    const onClickDelete = (movieId, userFrom) => {

        const variables = {
            movieId,
            userFrom
        }

        Axios.post('/api/favorite/removeFromFavorite', variables)
            .then(response => {
                if(response.data.success){
                    fetchFavoredMovie();
                } else {
                    alert('LISTから削除を失敗しました。')
                }
            })
    }

    const renderCards = Favorites.map((favorite, index) => {

        const content = (
            <div>
                {favorite.moviePost ?
                    <img src={`${IMAGE_URL}w500${favorite.moviePost}`} /> : "no image"}
                }
            </div>
        )

        return <tr key={index}>
            <Popover content={content} title={`${favorite.movieTitle}`}>
               <td>{favorite.movieTitle}</td>
            </Popover>
            <td>{favorite.movieRunTime} mins</td>
            <td><Button onClick={() => onClickDelete(favorite.movieId, favorite.userFrom)}>Remove</Button></td>
        </tr>
    })

    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h2> Favorite Movies </h2>
            <hr />

            <table>
                <thead>
                    <tr>
                        <th>Movie Title</th>
                        <th>Movie RunTime</th>
                        <td>Remove from favorites</td>
                    </tr>
                </thead>
                <tbody>

                {renderCards}

                </tbody>
            </table>
        </div>
    )
}

export default FavoritePage
