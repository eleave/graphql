const graphql = require('graphql');

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;

const Movies = require('../models/movie');
const Directors = require('../models/director');
// const moviesJson = [
//   { "name": "Pulp Fiction", "genre": "Crime", "directorId": "6206492655f0a35aa9a2367c" },
//   { "name": "1984", "genre": "Sci-Fi", "directorId": "6206499055f0a35aa9a2367d" },
//   { "name": "V for vendetta", "genre": "Sci-Fi-Triller", "directorId": "620649af55f0a35aa9a2367e" },
//   { "name": "Snatch", "genre": "Crime-Comedy", "directorId": "620649fcce84fd2c96f09fd3" },
//   { "name": "Reservoir Dogs", "genre": "Crime", "directorId": "6206492655f0a35aa9a2367c" },
//   { "name": "The Hateful Eight", "genre": "Crime", "directorId": "6206492655f0a35aa9a2367c" },
//   { "name": "Inglourious Basterds", "genre": "Crime", "directorId": "6206492655f0a35aa9a2367c" },
//   { "name": "Lock, Stock and Two Smoking Barrels", "genre": "Crime-Comedy", "directorId": "620649fcce84fd2c96f09fd3" },
// ];

// const directorsJson = [
//   { "name": "Quentin Tarantino", "age": 55 }, // 6206492655f0a35aa9a2367c
//   { "name": "Michael Radford", "age": 72 }, // 6206499055f0a35aa9a2367d
//   { "name": "James McTeigue", "age": 51 }, // 620649af55f0a35aa9a2367e
//   { "name": "Guy Ritchie", "age": 50 }, // 620649fcce84fd2c96f09fd3
// ];

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    genre: { type: new GraphQLNonNull(GraphQLString) },
    director: {
      type: DirectorType,
      resolve(parent, args) {
        return Directors.findById(parent.directorId)
      }
    }
  }),
});

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movies.find({directorId: parent.id})
      },
    }
  }),
});

const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addDirector: {
			type: DirectorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent, args) {
				const director = new Directors({
					name: args.name,
					age: args.age,
				});
				return director.save();
			},
		},
		addMovie: {
			type: MovieType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				directorId: { type: GraphQLID },
			},
			resolve(parent, args) {
				const movie = new Movies({
					name: args.name,
					genre: args.genre,
					directorId: args.directorId,
				});
				return movie.save();
			},
		},
    deleteDirector: {
			type: DirectorType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Directors.findByIdAndRemove(args.id);
			}
		},
		deleteMovie: {
			type: MovieType,
			args: { id: { type: GraphQLID } },
			resolve(parent, args) {
				return Movies.findByIdAndRemove(args.id);
			}
		},
    updateDirector: {
			type: DirectorType,
			args: {
				id: { type: GraphQLID },
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
			},
			resolve(parent, args) {
				return Directors.findByIdAndUpdate(
					args.id,
					{ $set: { name: args.name, age: args.age } },
					{ new: true },
				);
			},
		},
		updateMovie: {
			type: MovieType,
			args: {
				id: { type: GraphQLID },
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				directorId: { type: GraphQLID },
			},
			resolve(parent, args) {
				return Movies.findByIdAndUpdate(
					args.id,
					{ $set: { name: args.name, genre: args.genre, directorId: args.directorId } },
					{ new: true },
				);
			},
		},
	}
});

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movies.findById(args.id)
      },
    },
    director: {
      type: DirectorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Directors.findById(args.id)
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve(parent, args) {
        return Movies.find({})
      },
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve(parent, args) {
        return Directors.find({})
      },
    },
  }
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
});