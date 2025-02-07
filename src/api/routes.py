"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import requests
from flask import Flask, request, jsonify, url_for, Blueprint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from api.models import db, Users, Followers, Posts, Comments, Medias, Characters, CharacterFavorites, Planets, PlanetFavorites
from datetime import datetime, timezone
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt


api = Blueprint('api', __name__)
CORS(api)  # Allow CORS requests to this API


@api.route('/hello', methods=['GET'])
def handle_hello():
    response_body = {}
    response_body['message'] = "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    return jsonify(response_body), 200


# Create a route to authenticate your users and return JWTs. The create_access_token() function is used to actually generate the JWT.
@api.route("/login", methods=["POST"])
def login():
    response_body = {}
    data = request.json
    email = data.get("email", None)
    password = request.json.get("password", None)
    row = db.session.execute(db.select(Users).where(Users.email == email, Users.password == password, Users.is_active==True)).scalar()
    if not row:
        response_body['message'] = 'User not found'
        return response_body, 401
    user = row.serialize()
    claims = {'user_id': user['id'],
              'is_active': user['is_active']}
    print(claims)
    access_token = create_access_token(identity=email, additional_claims=claims)
    response_body['access_token'] = access_token
    response_body['message'] = 'User logged'
    response_body['results'] = user
    return response_body, 200


# Protect a route with jwt_required, which will kick out requests without a valid JWT present.
@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    response_body = {}
    current_user = get_jwt_identity()  # El email
    additional_claims = get_jwt()  # Los datos adionales
    print(current_user)
    print(additional_claims)
    response_body['message'] = 'Token válido'
    return response_body, 200


# CRUD de Users
@api.route('/users', methods=['GET'])
def users():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Users)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "List of users"
        response_body['results'] = result
        return response_body, 200
    
@api.route('/users/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def user(id):
    response_body = {}
    user = db.session.get(Users, id)
    if not user:
        response_body['message'] = "User not found"
        return response_body, 404
    
    if request.method == 'GET':
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = user.serialize()
        return response_body, 200
    
    if request.method == 'PUT':
        data = request.json
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.email = data.get("email", user.email)
        user.phone = data.get("phone", user.phone)
        user.is_active = data.get("is_active", user.is_active)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = user.serialize()
        return response_body, 200
    
    if request.method == 'DELETE':
        db.session.delete(user)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        return response_body, 200


# CRUD de Followers
@api.route('/followers', methods=['GET', 'POST'])
def followers():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Followers)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "List of followers"
        response_body['results'] = result
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        new_follower = Followers(
            following_id = data.get('following_id'),
            follower_id = data.get('follower_id'))
        db.session.add(new_follower)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = new_follower.serialize()
        return response_body, 201
    
@api.route('/followers/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def follower(id):
    response_body = {}
    follower = db.session.get(Followers, id)
    if not follower:
        response_body['message'] = "Follower not found"
        return response_body, 404
    
    if request.method == 'GET':
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = follower.serialize()
        return response_body, 200
    
    if request.method == 'PUT':
        data = request.json
        follower.following_id = data.get("following_id", follower.following_id)
        follower.follower_id = data.get("follower_id", follower.follower_id)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = follower.serialize()
        return response_body, 200
    
    if request.method == 'DELETE':
        db.session.delete(follower)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        return response_body, 200


# CRUD de Posts
@api.route('/posts', methods=['GET', 'POST'])
def posts():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Posts)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "List of posts"
        response_body['results'] = result
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        new_post = Posts(
            title = data.get("title"),
            description = data.get("description"),
            body = data.get("body"),
            date = datetime.strptime(data["date"], '%Y-%m-%d %H:%M:%S') if data.get("date") else datetime.now(timezone.utc),
            image_url = data.get("image_url"),
            user_id = data.get("user_id"))
        db.session.add(new_post)
        db.session.commit()
        response_body['message'] = f'Respuesta desde el {request.method}'
        response_body['results'] = new_post.serialize()
        return response_body, 201

@api.route('/posts/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def post(id):
    response_body = {}
    post = db.session.get(Posts, id)
    if not post:
        response_body["message"] = "Post not found"
        return response_body, 404
    
    if request.method == 'GET':
        response_body['message'] = f'Respuesta desde el {request.method}'
        response_body['results'] = post.serialize()
        return response_body, 200
    
    if request.method == 'PUT':
        data = request.json
        post.title = data.get("title", post.title)
        post.description = data.get("description", post.description)
        post.body = data.get("body", post.body)
        post.date = data.get("date", post.date)
        post.image_url = data.get("image_url", post.image_url)
        post.user_id = data.get("user_id", post.user_id)
        db.session.commit()
        response_body['message'] = f'Respuesta desde el {request.method}'
        response_body['results'] = post.serialize()
        return response_body, 200
    
    if request.method == 'DELETE':
        db.session.delete(post)
        db.session.commit()
        response_body['message'] = f'Respuesta desde el {request.method}'
        return response_body, 200
    

# CRUD de Comments
@api.route('/comments', methods=['GET', 'POST'])
def comments():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Comments)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "List of comments"
        response_body['results'] = result
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        new_comment = Comments(
            body = data.get("body"),
            user_id = data.get("user_id"),
            post_id = data.get("post_id"))
        db.session.add(new_comment)
        db.session.commit()
        response_body['message'] = f'Respuesta desde el {request.method}'
        response_body['results'] = new_comment.serialize()
        return response_body, 201

@api.route('/comments/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def comment(id):
    response_body = {}
    comment = db.session.get(Comments, id)
    if not comment:
        response_body["message"] = "Comment not found"
        return response_body, 404
    
    if request.method == 'GET':
        response_body['message'] = f'Respuesta desde el {request.method}'
        response_body['results'] = comment.serialize()
        return response_body, 200
    
    if request.method == 'PUT':
        data = request.json
        comment.body = data.get("body", comment.body)
        comment.user_id = data.get("user_id", comment.user_id)
        comment.post_id = data.get("post_id", comment.post_id)
        db.session.commit()
        response_body['message'] = f'Respuesta desde el {request.method}'
        response_body['results'] = comment.serialize()
        return response_body, 200
    
    if request.method == 'DELETE':
        db.session.delete(comment)
        db.session.commit()
        response_body['message'] = f'Respuesta desde el {request.method}'
        return response_body, 200
    

# CRUD de Medias
@api.route('/medias', methods=['GET', 'POST'])
def medias():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Medias)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "List of medias"
        response_body['results'] = result
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        new_media = Medias(
            type = data.get("type"),
            url = data.get("url"),
            post_id = data.get("post_id"))
        db.session.add(new_media)
        db.session.commit()
        response_body['message'] = f'Respuesta desde el {request.method}'
        response_body['results'] = new_media.serialize()
        return response_body, 201

@api.route('/medias/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def media(id):
    response_body = {}
    media = db.session.get(Medias, id)
    if not media:
        response_body["message"] = "Medias not found"
        return response_body, 404
    
    if request.method == 'GET':
        response_body['message'] = f'Respuesta desde el {request.method}'
        response_body['results'] = media.serialize()
        return response_body, 200
    
    if request.method == 'PUT':
        data = request.json
        media.type = data.get("type", media.type)
        media.url = data.get("url", media.url)
        media.post_id = data.get("post_id", media.post_id)
        db.session.commit()
        response_body['message'] = f'Respuesta desde el {request.method}'
        response_body['results'] = media.serialize()
        return response_body, 200
    
    if request.method == 'DELETE':
        db.session.delete(media)
        db.session.commit()
        response_body['message'] = f'Respuesta desde el {request.method}'
        return response_body, 200
    

# CRUD de Characters
@api.route('/characters', methods=['GET'])
def characters():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Characters)).scalars()
        response_body['message'] = "List of characters"
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200
    
@api.route('/swapi/characters', methods=['GET'])
def characters_swapi():
    response_body = {}
    url = 'https://swapi.tech/api/people'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        response_body['message'] = 'Characters imported from SWAPI'
        next = data.get('next')
        while True:
            results = data['results']
            for result in results:
                character_response = requests.get(result['url'])
                if character_response.status_code == 200:
                    character_data = character_response.json().get('result').get('properties')
                    character = Characters(
                        id = character_data.get('id'),
                        name = character_data.get('name'),
                        height = character_data.get('height'),
                        mass = character_data.get('mass'),
                        eye_color = character_data.get('eye_color'),
                        hair_color = character_data.get('hair_color'),
                        skin_color = character_data.get('skin_color'),
                        birth_year = character_data.get('birth_year'),
                        gender = character_data.get('gender'))
                    db.session.add(character)
                else:
                    response_body['message'] = 'Error importing the character from SWAPI'
                    db.session.rollback()
            if next is None:
                    break
            else:
                next_response = requests.get(next)
                data = next_response.json()
                next = data.get('next')
        db.session.commit()
        return response_body, 200
    return response_body, 400 


# CRUD de Favorites Characters
@api.route('/charactersfavorites', methods=['GET', 'POST'])
def favoritescharacters():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(CharacterFavorites)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "List of favorites characters"
        response_body['results'] = result
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        new_favorite = CharacterFavorites(
            user_id = data.get('user_id'),
            character_id = data.get('character_id'))
        db.session.add(new_favorite)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = new_favorite.serialize()
        return response_body, 201
    
@api.route('/charactersfavorites/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def favoritecharacter(id):
    response_body = {}
    favorite = db.session.get(CharacterFavorites, id)
    if not favorite:
        response_body['message'] = "Favorite not found"
        return response_body, 404
    
    if request.method == 'GET':
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = favorite.serialize()
        return response_body, 200
    
    if request.method == 'PUT':
        data = request.json
        favorite.user_id = data.get("user_id", favorite.user_id)
        favorite.character_id = data.get("character_id", favorite.character_id)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = favorite.serialize()
        return response_body, 200
    
    if request.method == 'DELETE':
        db.session.delete(favorite)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        return response_body, 200
    

# CRUD de Planets
@api.route('/planets', methods=['GET'])
def planets():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(Planets)).scalars()
        response_body['message'] = "List of planets"
        response_body['results'] = [row.serialize() for row in rows]
        return response_body, 200

@api.route('/swapi/planets', methods=['GET'])
def planets_swapi():
    response_body = {}
    url = 'https://swapi.tech/api/planets'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        response_body['message'] = 'Planets imported from SWAPI'
        next_url = data.get('next')

        while True:
            results = data['results']
            for result in results:
                planet_response = requests.get(result['url'])
                if planet_response.status_code == 200:
                    planet_data = planet_response.json().get('result').get('properties')

                    planet = Planets(
                        name=planet_data.get('name'),
                        diameter=planet_data.get('diameter'),
                        rotation_period=planet_data.get('rotation_period'),
                        orbital_period=planet_data.get('orbital_period'),
                        gravity=planet_data.get('gravity'),
                        population=planet_data.get('population'),
                        climate=planet_data.get('climate'),
                        terrain=planet_data.get('terrain'),
                        surface_water=planet_data.get('surface_water')
                    )
                    db.session.add(planet)
                else:
                    response_body['message'] = 'Error importing the planet from SWAPI'
                    db.session.rollback()

            if next_url is None:
                break
            else:
                next_response = requests.get(next_url)
                data = next_response.json()
                next_url = data.get('next')

        db.session.commit()
        return response_body, 200

    return response_body, 400


# CRUD de Favorites Planets
@api.route('/planetsfavorites', methods=['GET', 'POST'])
def favoritesplanets():
    response_body = {}
    if request.method == 'GET':
        rows = db.session.execute(db.select(PlanetFavorites)).scalars()
        result = [row.serialize() for row in rows]
        response_body['message'] = "List of favorites planets"
        response_body['results'] = result
        return response_body, 200
    
    if request.method == 'POST':
        data = request.json
        new_favorite = PlanetFavorites(
            user_id = data.get('user_id'),
            planet_id = data.get('planet_id'))
        db.session.add(new_favorite)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = new_favorite.serialize()
        return response_body, 201
    
@api.route('/planetsfavorites/<int:id>', methods=['GET', 'PUT', 'DELETE'])
def favoriteplanet(id):
    response_body = {}
    favorite = db.session.get(PlanetFavorites, id)
    if not favorite:
        response_body['message'] = "Favorite not found"
        return response_body, 404
    
    if request.method == 'GET':
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = favorite.serialize()
        return response_body, 200
    
    if request.method == 'PUT':
        data = request.json
        favorite.user_id = data.get("user_id", favorite.user_id)
        favorite.planet_id = data.get("planet_id", favorite.planet_id)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        response_body['results'] = favorite.serialize()
        return response_body, 200
    
    if request.method == 'DELETE':
        db.session.delete(favorite)
        db.session.commit()
        response_body['message'] = f'Respuesta desde {request.method}'
        return response_body, 200

