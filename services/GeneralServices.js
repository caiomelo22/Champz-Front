export default class Service {
  constructor() {}

  get_player_image_path(path) {
    var index = path.indexOf('Player');
    return `http://127.0.0.1:8000/wwwroot/${path.slice(index, path.length)}`
  }
  get_nation_image_path(path) {
    var index = path.indexOf('Nation');
    return `http://localhost:8000/wwwroot/${path.slice(index, path.length)}`
  }
  get_team_image_path(path) {
    var index = path.indexOf('Team');
    return `http://localhost:8000/wwwroot/${path.slice(index, path.length)}`
  }
}