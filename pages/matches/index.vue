<template>
  <v-container>
    <v-row v-if="loading" justify="center" align="center" class="pa-4">
      <v-progress-circular indeterminate size="40" color="primary">
      </v-progress-circular>
    </v-row>
    <div v-else>
      <v-card style="height: 100%">
        <v-toolbar color="primary" dark>
          <v-btn
            :disabled="!current_group_index"
            icon
            @click="previous_stage_click"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title class="mx-auto">{{
            selected_group.name
          }}</v-toolbar-title>
          <v-btn icon @click="next_stage_click" class="mr-2">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-toolbar>
        <v-row
          v-if="group_loading"
          justify="center"
          align="center"
          class="pa-4"
        >
          <v-progress-circular indeterminate size="20" color="primary">
          </v-progress-circular>
        </v-row>
        <v-row v-else>
          <v-col v-if="current_group_index == 0" cols="12" md="8">
            <v-row>
              <v-col cols="12" md="11">
                <table class="table table-striped">
                  <thead>
                    <tr>
                      <th class="champz-font" scope="col">Team</th>
                      <th class="champz-font" scope="col">P</th>
                      <th class="champz-font" scope="col">W</th>
                      <th class="champz-font" scope="col">D</th>
                      <th class="champz-font" scope="col">L</th>
                      <th class="champz-font" scope="col">GF</th>
                      <th class="champz-font" scope="col">GA</th>
                      <th class="champz-font" scope="col">GD</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(participant, i) in table" :key="i">
                      <td class="champz-font">
                        <img
                          style="width: 30px"
                          :src="
                            gs.get_team_image_path(
                              participant[0].team.image_path
                            )
                          "
                        />
                        {{ participant[0].name.toUpperCase() }}
                      </td>
                      <td class="champz-font">{{ participant[1].P }}</td>
                      <td class="champz-font">{{ participant[1].W }}</td>
                      <td class="champz-font">{{ participant[1].D }}</td>
                      <td class="champz-font">{{ participant[1].L }}</td>
                      <td class="champz-font">{{ participant[1].GF }}</td>
                      <td class="champz-font">{{ participant[1].GA }}</td>
                      <td class="champz-font">{{ participant[1].GD }}</td>
                    </tr>
                  </tbody>
                </table>
                <v-divider></v-divider>
              </v-col>
              <v-col cols="12" md="1" class="champz-divider">
                <v-divider vertical></v-divider>
              </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            :md="current_group_index ? 12 : 4"
            :class="current_group_index ? 'champz-knockout' : 'champz-matches'"
          >
            <v-simple-table :class="current_group_index ? 'mx-8' : 'mr-0'">
              <template v-slot:default>
                <thead class="thead-dark">
                  <tr>
                    <th class="champz-font text-center" scope="col">Match</th>
                    <th class="champz-font" scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(match, i) in selected_group.matches" :key="i">
                    <td
                      class="champz-font text-center"
                      v-if="
                        match.goals_participant_1 == null &&
                        match.goals_participant_2 == null
                      "
                    >
                      {{ match.participant_1.name.slice(0,3).toUpperCase() }}

                      <img
                        style="width: 30px"
                        :src="
                          gs.get_team_image_path(
                            match.participant_1.team.image_path
                          )
                        "
                      />
                      X
                      <img
                        style="width: 30px"
                        :src="
                          gs.get_team_image_path(
                            match.participant_2.team.image_path
                          )
                        "
                      />
                      {{ match.participant_2.name.slice(0,3).toUpperCase() }}
                    </td>
                    <td class="champz-font text-center" v-else>
                      {{ match.participant_1.name.slice(0,3).toUpperCase() }}
                      <img
                        style="width: 30px"
                        :src="
                          gs.get_team_image_path(
                            match.participant_1.team.image_path
                          )
                        "
                      />
                      {{ match.goals_participant_1 }} X
                      {{ match.goals_participant_2 }}
                      <img
                        style="width: 30px"
                        :src="
                          gs.get_team_image_path(
                            match.participant_2.team.image_path
                          )
                        "
                      />
                      {{ match.participant_2.name.slice(0,3).toUpperCase() }}
                    </td>
                    <td>
                      <v-btn
                        small
                        fab
                        color="primary"
                        @click="get_match(match)"
                      >
                        <v-icon small>mdi-pencil</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <div class="text-center">
          <v-btn
            large
            class="mx-auto mb-12"
            light
            color="primary"
            v-if="final"
            :loading="champz_file_loading"
            v-on:click="generate_champz_file()"
            >Generate Champz File</v-btn
          >
        </div>
      </v-card>
      <v-spacer></v-spacer>
      <a @click="reset_confirmation_dialog = true">Reset matches</a>
      <v-dialog v-model="reset_confirmation_dialog" width="40%">
        <v-card>
          <v-card-title>
            <h3>
              Are you sure that you want to reset the matches? All of the
              current groups are going to be erased.
            </h3>
          </v-card-title>
          <v-card-text>
            <v-card-actions class="text-center">
              <v-btn class="mx-auto" color="red" @click="reset_matches_click"
                >Reset</v-btn
              >
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <!-- Register Score Modal -->
    <v-dialog
      v-if="register_score_dialog"
      v-model="register_score_dialog"
      width="40%"
    >
      <v-card>
        <v-card-title>
          <h5>REGISTER SCORE</h5>
        </v-card-title>
        <v-card-text>
          <form v-on:submit.prevent="register_score()">
            <v-row>
              <v-col cols="12" md="3">
                <span class="champz-font mr-2 mt-1" style="float: right">{{
                  current_match.participant_1.name
                }}</span>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  outlined
                  dense
                  type="number"
                  v-model="current_match.goals_participant_1"
                  min="0"
                  required="required"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="2">
                <span class="champz-font ml-7 mt-1">X</span>
              </v-col>
              <v-col cols="12" md="2">
                <v-text-field
                  outlined
                  dense
                  type="number"
                  v-model="current_match.goals_participant_2"
                  min="0"
                  required="required"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="3">
                <span class="champz-font ml-3 mt-1" style="float: left">{{
                  current_match.participant_2.name
                }}</span>
              </v-col>
            </v-row>
            <v-card-actions>
              <v-btn
                type="button"
                color="red"
                @click="register_score_dialog = false"
                >Close</v-btn
              >
              <v-btn
                type="submit"
                color="green"
                :disabled="
                  !current_match.goals_participant_2 ||
                  !current_match.goals_participant_1
                "
                :loading="register_score_loading"
                >Save changes</v-btn
              >
            </v-card-actions>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- End Register Score modal -->
  </v-container>
</template>
<style lang="scss" scoped>
.champz-font {
  font-size: 15px;
  font-weight: 500;
  font-family: system-ui;
  vertical-align: inherit !important;
}
.table {
  height: 61vh;
}
.champz-divider {
  height: 64vh;
  display: flex;
  justify-content: center;
}
.champz-knockout {
  height: 100%;
}
.champz-matches {
  height: 100%;
  overflow-y: auto;
}
</style>
<script src="./index.js"></script>