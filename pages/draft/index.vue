<template>
  <div class="mx-4">
    <v-row style="margin-top: 32px" class="mt-4">
      <v-col cols="12" md="5" class="pl-0">
        <v-row>
          <v-card style="width: 100%">
            <v-card-text>
              <h5 style="font-weight: bold !important; color: black">Set budget</h5>
              <v-text-field class="mt-2" min="0" v-model="genericBudget" hide-details dense outlined flat>
              </v-text-field>
            </v-card-text>
          </v-card>
        </v-row>
        <v-row style="margin-top: 32px">
          <v-card style="width: 100%">
            <v-card-title>
              <h3 style="font-weight: bold !important">List of participants</h3>
              <v-spacer></v-spacer>
              <v-icon large color="green" @click="open_participant_dialog(null)">mdi-plus</v-icon>
            </v-card-title>
            <v-card-text>
              <v-row v-if="participants_loading" class="loader-row">
                <v-progress-circular indeterminate size="20" color="#3330E4"></v-progress-circular>
              </v-row>
              <div class="champz-table-wrapper" v-else>
                <table class="champz-table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">
                        <b>Name</b>
                      </th>
                      <th scope="col">
                        <b>Budget</b>
                      </th>
                      <th scope="col">
                        <b>Team</b>
                      </th>
                      <th scope="col" class="text-center">
                        <b>Action</b>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(participant, i) in participants" :key="i">
                      <td class="champzFont">{{ participant.id }}</td>
                      <td class="champzFont">{{ participant.name }}</td>
                      <td class="champzFont">${{ participant.budget }}</td>
                      <td class="champzFont">
                        <img style="width: 30px" :src="gs.get_team_image_path(participant.team.image_path)" />
                        {{ participant.team.name }}
                      </td>
                      <td class="text-center">
                        <v-icon color="#3330E4" @click="open_participant_dialog(participant)">mdi-pencil</v-icon>
                        <v-icon color="#EB1D36" class="ml-2" @click="delete_participant(participant.id)">mdi-trash-can
                        </v-icon>
                        <v-icon color="#3330E4" class="ml-2" :loading="participant.team_loading_att" @click="
                          get_players_by_team(participant, participant.team.id)
                        ">mdi-eye</v-icon>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
      <v-col cols="12" md="7" class="pr-0">
        <v-row>
          <v-card style="width: 100%">
            <v-card-title>
              <h3 style="font-weight: bold !important">List of Players</h3>
            </v-card-title>
            <v-card-text>
              <v-tabs v-model="tab" color="#3330E4">
                <v-tab v-for="(p, i) in positions" :key="i">
                  {{ p.name }}
                </v-tab>
              </v-tabs>
              <v-row justify="center" v-if="players_loading" class="my-6 pa-4">
                <v-progress-circular indeterminate size="15"></v-progress-circular>
              </v-row>
              <div class="champz-table-wrapper mt-4" v-else-if="tab != -1">
                <table class="champz-table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">
                        <b>Player</b>
                      </th>
                      <th></th>
                      <th scope="col">
                        <b>Overall</b>
                      </th>
                      <th scope="col">
                        <b>Position</b>
                      </th>
                      <th scope="col">
                        <b>Owner</b>
                      </th>
                      <th scope="col">
                        <b>Price</b>
                      </th>
                      <th scope="col">
                        <b>Action</b>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="player in selected_position"
                      :key="`${player.id}-${player.team_participant}-${player.value}`">
                      <td class="champzFont">{{ player.id }}</td>
                      <td class="champzFont">
                        <img :src="gs.get_player_image_path(player.image_path)" style="max-height: 80px" />
                        <img style="width: 30px" :src="gs.get_nation_image_path(player.nation.image_path)" />
                        <img style="width: 30px" :src="gs.get_team_image_path(player.team_origin.image_path)" />
                      </td>
                      <td class="champzFont">
                        <span>{{ player.name }}</span>
                      </td>
                      <td class="champzFont">{{ player.overall }}</td>
                      <td class="champzFont">{{ player.specific_position }}</td>
                      <td class="champzFont">
                        {{
                            player.team_participant
                              ? get_participant_name(
                                player.team_participant.participant
                              )
                              : "-"
                        }}
                      </td>
                      <td class="champzFont">${{ player.value }}</td>
                      <td>
                        <v-icon color="#2B7A0B" large @click="get_player(player)">mdi-cash-plus</v-icon>
                        <v-icon color="#EB1D36" class="ml-2" large @click="remove_buy(player)">mdi-cash-minus</v-icon>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </v-card-text>
          </v-card>
        </v-row>
      </v-col>
    </v-row>

    <!-- <h3>List of Players</h3>
      
      <div class="container">
        <button
          class="btn btn-outline-info"
          v-on:click="generate_transfers_file()"
        >Generate Transfers File</button>
        <button
          class="btn btn-outline-info"
          v-on:click="generate_players_file()"
        >Generate Players Excel</button>
        <button
          class="btn btn-outline-info"
          v-on:click="generate_teams_file()"
        >Generate Participants Teams Excel</button>
        <a style="float: right;" class="btn btn-success" :href="'/webapp/matches'">Matches</a>
      </div>
      <br />
      <br />
      <br />
    <br />-->
    <!-- Add Participant Modal -->
    <v-dialog v-if="addParticipantModal" v-model="addParticipantModal" width="700px" max-width="100%">
      <AddParticipant :participant-prop="newParticipant" :pl-teams="plTeams" @close="reset_participant_dialog"
        @update="participant_added" />
    </v-dialog>
    <!-- Buy Player Modal -->
    <v-dialog v-if="buy_player_modal" v-model="buy_player_modal" width="40%" persistent>
      <v-card>
        <v-card-title>
          <h5>BUY PLAYER</h5>
        </v-card-title>
        <v-card-text>
          <div class="text-center" style="display: flex; justify-content: center; position: relative">
            <div class="card-info">
              <div class="card-left-info">
                <span style="
                    margin-bottom: 10px;
                    font-size: 40px;
                    font-weight: bold;
                    z-index: 2;
                  ">{{ current_player.overall }}</span>
                <span style="font-size: 25px; z-index: 2">{{
                    current_player.specific_position
                }}</span>
                <img style="width: 60px; z-index: 2; margin: auto"
                  :src="gs.get_nation_image_path(current_player.nation.image_path)" />
                <img style="width: 60px; z-index: 2; margin: auto" :src="
                  gs.get_team_image_path(current_player.team_origin.image_path)
                " />
              </div>
              <img :src="gs.get_player_image_path(current_player.image_path)" style="
                  max-height: 160px;
                  z-index: 2;
                  position: absolute;
                  top: 100px;
                  left: -28px;
                " />
              <div class="card-name">
                <span style="font-weight: 700; font-size: 17px">{{
                    current_player.name
                }}</span>
              </div>
              <div class="card-stats">
                <div class="vertical-divisor"></div>
                <div class="card-stats-left">
                  <v-row no-gutters>
                    <span class="mr-1 card-stat-value">{{
                        current_player.pace
                    }}</span><span class="mr-1 card-stat-name">PAC</span>
                  </v-row>
                  <v-row no-gutters>
                    <span class="mr-1 card-stat-value">{{
                        current_player.shooting
                    }}</span><span class="mr-1 card-stat-name">SHO</span>
                  </v-row>
                  <v-row no-gutters>
                    <span class="mr-1 card-stat-value">{{
                        current_player.passing
                    }}</span><span class="mr-1 card-stat-name">PAS</span>
                  </v-row>
                </div>
                <div class="card-stats-right text-end">
                  <v-row no-gutters>
                    <span class="mr-1 card-stat-value">{{
                        current_player.dribbling
                    }}</span><span class="mr-1 card-stat-name">DRI</span>
                  </v-row>
                  <v-row no-gutters>
                    <span class="mr-1 card-stat-value">{{
                        current_player.defending
                    }}</span><span class="mr-1 card-stat-name">DEF</span>
                  </v-row>
                  <v-row no-gutters>
                    <span class="mr-1 card-stat-value">{{
                        current_player.physical
                    }}</span><span class="mr-1 card-stat-name">PHY</span>
                  </v-row>
                </div>
              </div>
            </div>
            <img src="~/assets/gold.png" style="height: 500px; z-index: 1" />
          </div>
          <form v-on:submit.prevent="buy_player()">
            <v-text-field type="number" v-model="current_player.value" label="Value" prefix="$"></v-text-field>
            <v-combobox v-model="participant_selected" :items="participants" item-text="name" @change="
              current_player.team_participant = participant_selected.team
            " label="Participant" outlined dense></v-combobox>
            <v-card-actions style="display: flex; justify-content: flex-end">
              <v-btn color="red" @click="reset_player_modal">Cancel</v-btn>
              <v-btn type="submit" color="green" :loading="updating_player">Save changes</v-btn>
            </v-card-actions>
          </form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- Show participant team Modal -->
    <v-dialog v-model="participant_team_modal" width="60%">
      <v-card>
        <v-card-title>
          <h5>{{ current_participant.name }}'s Team</h5>
        </v-card-title>
        <v-card-text>
          <v-simple-table>
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Overall</th>
                <th scope="col">Price</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(player, i) in selected_team" :key="i">
                <th scope="row">{{ player.id }}</th>
                <td>{{ player.name }}</td>
                <td>{{ player.overall }}</td>
                <td>{{ player.value }}</td>
                <td>
                  <v-btn color="red" @click="remove_buy(player)">
                    Remove Buy
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<style lang="scss" scoped>
.card-info {
  position: absolute;
}

.card-stat-name {
  font-weight: 400;
}

.card-stat-value {
  font-weight: bold;
}

.vertical-divisor {
  height: 100%;
  width: 1px;
  top: 65%;
  opacity: 0.8;
  margin-left: auto;
  margin-right: auto;
  display: block;
  background-color: #645215;
}

.card-name {
  z-index: 2;
  position: absolute;
  top: 261px;
  left: -137px;
  width: 273px;
}

.card-stats-left {
  position: absolute;
  width: 50%;
  bottom: 16px;
  padding-left: 50px;
  font-size: 20px;
}

.card-stats-right {
  position: absolute;
  width: 50%;
  bottom: 16px;
  right: 0;
  padding-left: 20px;
  font-size: 20px;
}

.card-stats {
  z-index: 2;
  position: absolute;
  top: 300px;
  left: -136px;
  height: 102px;
  width: 273px;
}

.card-left-info {
  z-index: 2;
  display: grid;
  margin-left: -120px;
  margin-top: 63px;
}

.champzFont {
  font-size: 18px;
  font-weight: 500;
  font-family: system-ui;
}
</style>
<script src="./index"></script>