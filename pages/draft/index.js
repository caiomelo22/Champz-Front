import GeneralServices from "@/services/GeneralServices";
import AddParticipant from "@/components/dialogs/addParticipant/index.vue";
export default {
  name: "Draft",
  components: { AddParticipant },
  data: () => ({
    gs: new GeneralServices(),
    tab: 0,
    addParticipantModal: false,
    buy_player_modal: false,
    participant_team_modal: false,
    participants: [],
    genericBudget: 250,
    positions: [],
    leagues: [],
    selected_position: [],
    plTeams: [],
    players_loading: false,
    updating_player: false,
    removing_player: false,
    updating_participant: false,
    participants_loading: false,
    current_player: {},
    current_participant: {},
    selected_team: null,
    participant_selected: null,
    newParticipant: { name: null, budget: null, team: null },
  }),
  watch: {
    participant_team_modal() {
      if (!this.participant_team_modal) {
        this.selected_team = [];
      }
    },
    tab() {
      this.get_players_by_position_algorithm(this.positions[this.tab].id);
    },
  },
  async created() {
    await this.get_participants();
    await this.get_leagues();
    await this.get_plTeams();
    await this.get_positions();
  },
  methods: {
    reset_player_modal() {
      this.participant_selected = null;
      this.buy_player_modal = false;
    },
    reset_participant_dialog() {
      this.newParticipant = null;
      this.addParticipantModal = false;
    },
    participant_added(participant) {
      console.log(this.positions[this.tab].id)
      if (!this.newParticipant.id) {
        this.participants.push(participant);
        this.reset_participant_dialog();
        this.get_players_by_position_algorithm(this.positions[this.tab].id);
      } else {
        let index = this.participants
          .map((x) => x.id)
          .indexOf(this.newParticipant.id);
        this.participants = this.participants
          .slice(0, index)
          .concat([participant])
          .concat(
            this.participants.slice(index + 1, this.participants.length)
          );
        this.addParticipantModal = false;
        this.get_players_by_position_algorithm(this.positions[this.tab].id);
      }
    },
    get_participant_name(id) {
      if (!id) {
        return null;
      }
      return this.participants.filter(x => x.id == id)[0].name;
    },
    open_participant_dialog(participant) {
      if (!participant) {
        this.newParticipant = { name: null, budget: this.genericBudget, team: null };
      } else {
        this.newParticipant = JSON.parse(JSON.stringify(participant));
      }
      this.addParticipantModal = true;
    },
    async get_participants() {
      this.participants_loading = true;
      await this.$axios
        .get("participant")
        .then((response) => {
          this.participants = response.data;
        })
        .catch((err) => {
          console.log(err)
        });
      this.participants_loading = false;
    },
    async get_positions() {
      this.players_loading = true;
      await this.$axios
        .get("position")
        .then((response) => {
          this.positions = response.data;
          this.get_players_by_position_algorithm(response[0].id);
        })
        .catch((err) => { });
      this.players_loading = false;
    },
    async get_players_by_position_algorithm(idPosition) {
      this.players_loading = true;
      await this.$axios
        .get(`player?position=${idPosition}`)
        .then((response) => {
          this.selected_position = response.data;
        })
        .catch((err) => { });
      this.players_loading = false;
    },
    async get_players_by_team(participant, idTeam) {
      this.current_participant = participant;
      let index = this.participants.map((x) => x.id).indexOf(participant.id);
      this.participants[index].team_loading_att = true;
      await this.$axios
        .get(`player?team_participant=${idTeam}`)
        .then((response) => {
          this.selected_team = response.data;
        })
        .catch((err) => { });
      this.participants[index].team_loading_att = false;
      this.participant_team_modal = true;
    },
    async get_plTeams() {
      let pl = this.leagues.filter((x) => x.name.includes("ENG 1"))[0];
      await this.$axios
        .get(`team?league=${pl.id}`)
        .then((response) => {
          this.plTeams = response.data;
        })
        .catch((err) => { });
    },
    async get_leagues() {
      await this.$axios
        .get("league")
        .then((response) => {
          this.leagues = response.data;
        })
        .catch((err) => { });
    },
    get_player(player) {
      this.current_player = JSON.parse(JSON.stringify(player));
      this.buy_player_modal = true;
    },
    async delete_participant(id) {
      let url = `participant/${id}`;
      let index = this.participants.map((x) => x.id).indexOf(id);
      this.participants.splice(index, 1);
      await this.$axios
        .delete(url)
        .then((response) => {
          this.get_players_by_position_algorithm(this.positions[this.tab].id);
        })
        .catch((err) => { });
    },
    async remove_buy(player) {
      this.update_participant_budget(player, true);
      await this.$axios
        .post(`buy/${player.id}`, { team_participant: null })
        .then((response) => {
          this.update_player(response);
          if (this.selected_team.length > 0) {
            let index = this.selected_team.map((x) => x.id).indexOf(player.id);
            if (index != -1) {
              this.selected_team.splice(index, 1);
            }
          }
        })
        .catch((err) => { });
    },
    update_participant_budget(player, add) {
      let index = this.participants
        .map((x) => x.team.id)
        .indexOf(player.team_participant.id);
      if (index != -1) {
        if (add) {
          this.participants[index].budget += player.value;
        } else {
          this.participants[index].budget -= player.value;
        }
      }
    },
    update_player(player) {
      if (this.positions[this.tab].id == player.position.id) {
        let index = this.selected_position.map((x) => x.id).indexOf(player.id);
        this.selected_position = this.selected_position
          .slice(0, index)
          .concat([player])
          .concat(
            this.selected_position.slice(
              index + 1,
              this.selected_position.length
            )
          );
      }
    },
    async buy_player() {
      this.updating_player = true;
      let player = JSON.parse(JSON.stringify(this.current_player));
      player.team_participant = this.current_player.team_participant.id;
      let url = `buy/${this.current_player.id}`;
      await this.$axios
        .post(url, player)
        .then((response) => {
          let player = response.data;
          this.update_player(player);
          this.update_participant_budget(player, false);
          this.participant_selected = null;
          this.buy_player_modal = false;
        })
        .catch((err) => { });
      this.updating_player = false;
    },
    async generate_transfers_file() {
      let url = "transfers";
      await this.$axios
        .post(url)
        .then((response) => { })
        .catch((err) => { });
    },
    async generate_teams_file() {
      let url = "participants_teams";
      await this.$axios
        .post(url)
        .then((response) => { })
        .catch((err) => { });
    },
    async generate_players_file() {
      let url = "champz_players";
      await this.$axios
        .post(url)
        .then((response) => { })
        .catch((err) => { });
    },
  },
  computed: {},
};