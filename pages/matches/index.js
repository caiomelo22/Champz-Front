import GeneralServices from "@/services/GeneralServices";
export default {
  name: "Matches",
  data: () => ({
    gs: new GeneralServices(),
    final: false,
    register_score_dialog: false,
    reset_confirmation_dialog: false,
    selected_group: {},
    table: [],
    current_match: {},
    current_group_index: 0,
    loading: true,
    group_loading: false,
    register_score_loading: false,
    champz_file_loading: false,
    replace: [false, false, false, false],
  }),
  async created() {
    await this.get_group_stage(false);
    this.loading = false;
  },
  methods: {
    async next_stage_click() {
      this.group_loading = true;
      this.current_group_index += 1;
      switch (this.current_group_index) {
        case 1:
          await this.get_wildcard(this.replace[this.current_group_index]);
          break;
        case 2:
          await this.get_semis(this.replace[this.current_group_index]);
          break;
        case 3:
          await this.get_final(this.replace[this.current_group_index]);
          break;
      }
      this.replace[this.current_group_index] = false;
      this.group_loading = false;
    },
    async previous_stage_click() {
      this.group_loading = true;
      this.current_group_index -= 1;
      switch (this.current_group_index) {
        case 0:
          await this.get_group_stage(false);
          break;
        case 1:
          await this.get_wildcard(false);
          break;
        case 2:
          await this.get_semis(false);
          break;
      }
      this.group_loading = false;
    },
    get_match: function (match) {
      this.current_match = JSON.parse(JSON.stringify(match));
      this.register_score_dialog = true;
    },
    register_score: async function () {
      this.register_score_loading = true;
      var match_index = this.selected_group.matches
        .map((x) => x.id)
        .indexOf(this.current_match.id);
      this.selected_group.matches = this.selected_group.matches
        .slice(0, match_index)
        .concat([this.current_match])
        .concat(
          this.selected_group.matches.slice(
            match_index + 1,
            this.selected_group.length
          )
        );
      // Setting the replace flag to true to update de matchups for the next stage
      if (this.current_group_index != 3) {
        this.replace[this.current_group_index + 1] = true;
      }
      var url = `match/${this.current_match.id}`;
      await this.$axios
        .patch(url, this.current_match)
        .then((response) => {})
        .catch((err) => {});
      if (this.current_group_index == 0) {
        await this.get_table(this.selected_group.id);
      }
      this.register_score_loading = false;
      this.register_score_dialog = false;
    },
    async reset_matches_click() {
      await this.get_group_stage(true);
      this.replace = [false, false, false, false];
      this.current_group_index = 0;
      this.reset_confirmation_dialog = false;
    },
    get_group_stage: async function (replace) {
      await this.$axios
        .post(`group-stage`, { replace: replace })
        .then((response) => {
          this.selected_group = response;
        })
        .catch((err) => {});
      if ((this.table.length == 0 || replace) && this.selected_group.id) {
        await this.get_table(this.selected_group.id);
      }
    },
    get_table: async function (id) {
      await this.$axios
        .get(`table/${id}`)
        .then((response) => {
          this.table = response;
        })
        .catch((err) => {});
    },
    get_wildcard: async function (replace) {
      await this.$axios
        .post("wildcards", { replace: replace })
        .then((response) => {
          this.selected_group = response;
        })
        .catch((err) => {});
    },
    get_semis: async function (replace) {
      await this.$axios
        .post("semis", { replace: replace })
        .then((response) => {
          this.selected_group = response;
          this.final = false;
        })
        .catch((err) => {});
    },
    get_final: async function (replace) {
      await this.$axios
        .post("final", { replace: replace })
        .then((response) => {
          this.selected_group = response;
          this.final = true;
        })
        .catch((err) => {});
    },
    generate_champz_file: async function () {
      this.champz_file_loading = true;
      await this.$axios
        .post("end-champz")
        .then((response) => {})
        .catch((err) => {});
      this.champz_file_loading = false;
    },
  },
  computed: {},
};