"use client";

export function TowerGameApp() {
  const towerGameHtml = `<!DOCTYPE html>
<html>
	<head>
		<base href="https://hazeman.github.io/Tower-Defense/">
		<title>Hazeman's Tower Defense</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="author" content="Nizomiddin Toshpulatov, Hazeman">
		<meta name="description" content="Free online tower defense game. Defend yourself!">
		<meta name="keywords" content="tower defense, online, free, game, hazeman, STU, FIIT">
		<link rel="stylesheet" href="css/styles.css">
		<link rel="stylesheet" href="css/responsive.css">
		<script src="js/utils.js"></script>
		<script src="js/blocks.js"></script>
		<script src="js/maps.js"></script>
		<script src="js/welcome.js"></script>
		<script src="js/charge.js"></script>
		<script src="js/towers.js"></script>
		<script src="js/enemies.js"></script>
		<script src="js/statistics.js"></script>
		<script src="js/shop.js"></script>
		<script src="js/game.js"></script>
		<script src="js/main.js"></script>
	</head>
	<body>
		<section class="welcome" id="welcome">
            <div class="welcome__text">
                <h1 class="welcome__title">Hazeman's tower defense<br><small>- defend yourself -</small></h1>
				<p class="welcome__body">Press any key to continue...</p>
				<summary>Created by Hazeman. Slovak University of Technology Faculty of Informatics And Information Technolgies. Bratislava, 2019.</summary>
            </div>
            <canvas id="welcome-canvas" width="400" height="200"></canvas>
		</section>
		
		<section class="defeat" id="defeat">
            <div class="defeat__text">
                <h1 class="defeat__title">You lost<br><small>- Game Over -</small></h1>
				<p class="defeat__body"><i>Refresh the page to try again...</i></p>
            </div>
            <section class="game__stats">
				<h2 class="game__stats__title"><mark class="yellow_">Statistics</mark></h2>
				<h3 class="game__stats__subtitle game__stats__towers-stat-title">Towers</h3>
				<p class="game__stats__towers-stat-names">
					Amount: <br>
					Upgradable: <br>
					Max tier:
				</p>
				<p class="game__stats__towers-stat-values">
					<mark class="cyan_"><b id="towers_amount_end">13</b></mark><br>
					<mark class="yellow_"><b id="towers_upgradable_end">5</b></mark><br>
					<mark class="violet_"><b id="towers_max-tier_end">3</b></mark>
				</p>
				<h3 class="game__stats__subtitle game__stats__enemies-stat-title">Enemies</h3>
				<p class="game__stats__enemies-stat-names">
					Amount: <br>
					Max tier: <br>
					Defeated:
				</p>
				<p class="game__stats__enemies-stat-values">
					<mark class="toxic-green_"><b id="toxic-carriers_amount_end">7</b></mark><br>
					<mark class="violet_"><b id="toxic-carriers_max-tier_end">3</b></mark><br>
					<mark class="red_"><b id="toxic-carriers_total-defeated_end">43</b></mark>
				</p>
				<h3 class="game__stats__subtitle game__stats__wave-stat-title">Wave</h3>
				<p class="game__stats__wave-stat-names">
					Current: <br>
					<mark class="red_">*</mark>Until next:
				</p>
				<p class="game__stats__wave-stat-values">
					<mark class="green_"><b id="wave_current_end">2</b></mark><br>
					<mark class="orange_"><b id="wave_until-next_end">13</b></mark>
				</p>
				<summary class="game__stats__summary">
					<mark class="red_">*</mark>Enemies required to defeat, before next wave starts.
				</summary>
			</section>
		</section>
		
		<main class="game" id="game">

			<div class="game__message tooltip right" id="message">
				<p class="game__message__explanation-mark">!</p>
				<h3 class="game__message__title" id="message-title"></h3>
				<p class="game__message__body" id="message-body"></p>
				<button class="game__message__button" id="do-not-show">Don't show messages</button>
			</div>

			<input id="menu-button" type="checkbox"></input>
			<label class="game__menu-button" for="menu-button">
				<svg width="35" height="19">
					<rect x="10" y="0" width="35" height="3"></rect>
					<rect x="5" y="8" width="35" height="3"></rect>
					<rect y="16" width="35" height="3"></rect>
				</svg>
			</label>
			
			<h1 class="game__title">Hazeman's tower defense<br><small>- defend yourself -</small></h1>

			<section class="game__menu">
				<h2 class="game__menu__title">Towers</h2>
				<div class="game__menu__tower" id="galactic-marine-purchase-btn">
					<img class="game__menu__tower-thumbnail" id="galactic-marine-thumbnail" width="100" height="100" src="media/svg/towers/galactic-marine-frame-0.svg">
					<h3 class="game__menu__tower-title"><mark class="cyan_">Galactic Marine</mark></h3>
					<p class="game__menu__tower-description">
						Tier 1 tower with basic stats. Click to buy one unit of Galactic Marines special force.   
					</p>
					<p class="game__menu__tower-price">100</p>
				</div>
				<div class="game__menu__tower" id="orcus-charger-purchase-btn">
					<img class="game__menu__tower-thumbnail" id="orcus-charger-thumbnail" width="100" height="100" src="media/svg/towers/orcus-charger-frame-0.svg">
					<h3 class="game__menu__tower-title"><mark class="orange_">Orcus Charger</mark></h3>
					<p class="game__menu__tower-description">
						Tier 2 tower with advance stats. Click to buy one unit of Orcus Charger elite force.
					</p>
					<p class="game__menu__tower-price">1500</p>
				</div>
				<div class="game__menu__tower" id="cpt-andromeda-purchase-btn">
					<img class="game__menu__tower-thumbnail" id="cpt-andromeda-thumbnail" width="100" height="100" src="media/svg/towers/cpt-andromeda-frame-0.svg">
					<h3 class="game__menu__tower-title"><mark class="darkviolet_">Cpt. Andromeda</mark></h3>
					<p class="game__menu__tower-description">
						Tier 3 tower with powerful stats. Click to buy captain Andromeda, legendary warrior.
					</p>
					<p class="game__menu__tower-price">5000</p>
				</div>
			</section>

			<div id="canvas">
				<div id="next-wave"><span>Next Wave</span></div>
				<div id="cancel-purchase">Cancel Purchase</div>
				<div id="tower-upgraded">Upgrade!</div>
				<div class="game__tower-info tooltip" id="tower-info">
					<h3 class="game__tower-name">Galactic Marine</h3>
					<ul class="game__tower-stats">
						<li>Current EXP: <mark class="yellow_"><b id="current-exp">13</b></mark></li>
						<li>Rotation Speed: <mark class="violet_"><b id="rotation-speed">13</b></mark><br></li>
						<li>Fire Rate: <mark class="orange_"><b id="fire-rate">13</b></mark><br></li>
						<li>Charge Power: <mark class="cyan_"><b id="charge-power">13</b></mark><br></li>
						<li>Charge Speed: <mark class="blue_"><b id="charge-speed">13</b></mark><br></li>
					</ul>
					<button class="game__tower-upgrade" id="upgrade">Upgrade</button>
					<button class="game__tower-sell" id="sell">Sell</button>
					<ul class="game__tower-stats_upgrade tooltip left" id="tower-info_upgrade">
						<li>Rotation Speed: <b id="rotation-speed_upgrade">1.5</b><br></li>
						<li>Fire Rate: <b id="fire-rate_upgrade">2.5</b><br></li>
						<li>Charge Power: <b id="charge-power_upgrade">3.5</b><br></li>
						<li>Charge Speed: <b id="charge-speed_upgrade">1.5</b><br></li>
						<li><b><br>Price: <span id="upgrade-price">100 NG</span></b></li>
					</ul>
				</div>
				<canvas id="background-canvas" width="1000" height="600"></canvas>
				<canvas id="main-canvas" width="1000" height="600"></canvas>
			</div>

			<section class="game__stats">
				<h2 class="game__stats__title"><mark class="yellow_">Statistics</mark></h2>
				<h3 class="game__stats__subtitle game__stats__towers-stat-title">Towers</h3>
				<p class="game__stats__towers-stat-names">
					Amount: <br>
					Upgradable: <br>
					Max tier:
				</p>
				<p class="game__stats__towers-stat-values">
					<mark class="cyan_"><b id="towers_amount">13</b></mark><br>
					<mark class="yellow_"><b id="towers_upgradable">5</b></mark><br>
					<mark class="violet_"><b id="towers_max-tier">3</b></mark>
				</p>
				<h3 class="game__stats__subtitle game__stats__enemies-stat-title">Enemies</h3>
				<p class="game__stats__enemies-stat-names">
					Amount: <br>
					Max tier: <br>
					Defeated:
				</p>
				<p class="game__stats__enemies-stat-values">
					<mark class="toxic-green_"><b id="toxic-carriers_amount">7</b></mark><br>
					<mark class="violet_"><b id="toxic-carriers_max-tier">3</b></mark><br>
					<mark class="red_"><b id="toxic-carriers_total-defeated">43</b></mark>
				</p>
				<h3 class="game__stats__subtitle game__stats__wave-stat-title">Wave</h3>
				<p class="game__stats__wave-stat-names">
					Current: <br>
					<mark class="red_">*</mark>Until next:
				</p>
				<p class="game__stats__wave-stat-values">
					<mark class="green_"><b id="wave_current">2</b></mark><br>
					<mark class="orange_"><b id="wave_until-next">13</b></mark>
				</p>
				<summary class="game__stats__summary">
					<mark class="red_">*</mark>Enemies required to defeat, before next wave starts.
				</summary>
			</section>

			<div class="game__sound-control" id="sound-control"></div>

			<p class="game__nuclear-gold_minus" id="nuclear-gold-minus">100</p>
			<p class="game__nuclear-gold_plus" id="nuclear-gold-plus">100</p>
			<p class="game__nuclear-gold" id="nuclear-gold">100</p>

			<summary class="game__summary">
				Created by Hazeman. Slovak University of Technology Faculty of Informatics And Information Technolgies. Bratislava, 2019.
			</summary>
		</main>

		<div id="assets">

			<img id="breach" src="media/svg/misc/breach.svg" alt="" hidden="true">
			<img id="nexus" src="media/svg/misc/nexus.svg" alt="" hidden="true">
	
			<!-- Towers -->
			
			<img id="galacticMarine_0" src="media/svg/towers/galactic-marine-frame-0.svg" alt="" hidden="true">
			<img id="galacticMarine_1" src="media/svg/towers/galactic-marine-frame-1.svg" alt="" hidden="true">
			<img id="galacticMarine_2" src="media/svg/towers/galactic-marine-frame-2.svg" alt="" hidden="true">
			<img id="galacticMarine_3" src="media/svg/towers/galactic-marine-frame-3.svg" alt="" hidden="true">
			<img id="galacticMarine_4" src="media/svg/towers/galactic-marine-frame-4.svg" alt="" hidden="true">
			<img id="galacticMarine_unavailable" src="media/svg/towers/galactic-marine-unavailable.svg" alt="" hidden="true">
	
			<img id="orcusCharger_0" src="media/svg/towers/orcus-charger-frame-0.svg" alt="" hidden="true">
			<img id="orcusCharger_1" src="media/svg/towers/orcus-charger-frame-1.svg" alt="" hidden="true">
			<img id="orcusCharger_2" src="media/svg/towers/orcus-charger-frame-2.svg" alt="" hidden="true">
			<img id="orcusCharger_3" src="media/svg/towers/orcus-charger-frame-3.svg" alt="" hidden="true">
			<img id="orcusCharger_4" src="media/svg/towers/orcus-charger-frame-4.svg" alt="" hidden="true">
			<img id="orcusCharger_unavailable" src="media/svg/towers/orcus-charger-unavailable.svg" alt="" hidden="true">
	
			<img id="cptAndromeda_0" src="media/svg/towers/cpt-andromeda-frame-0.svg" alt="" hidden="true">
			<img id="cptAndromeda_1" src="media/svg/towers/cpt-andromeda-frame-1.svg" alt="" hidden="true">
			<img id="cptAndromeda_2" src="media/svg/towers/cpt-andromeda-frame-2.svg" alt="" hidden="true">
			<img id="cptAndromeda_3" src="media/svg/towers/cpt-andromeda-frame-3.svg" alt="" hidden="true">
			<img id="cptAndromeda_4" src="media/svg/towers/cpt-andromeda-frame-4.svg" alt="" hidden="true">
			<img id="cptAndromeda_unavailable" src="media/svg/towers/cpt-andromeda-unavailable.svg" alt="" hidden="true">
	
			<!-- Enemies -->
	
			<img id="toxicCarrier_0" src="media/svg/enemies/toxic-carrier-frame-0.svg" alt="" hidden="true">
			<img id="toxicCarrier_1" src="media/svg/enemies/toxic-carrier-frame-1.svg" alt="" hidden="true">
			<img id="toxicCarrier_0_hit" src="media/svg/enemies/toxic-carrier-frame-0-hit.svg" alt="" hidden="true">
			<img id="toxicCarrier_1_hit" src="media/svg/enemies/toxic-carrier-frame-1-hit.svg" alt="" hidden="true">
	
			<img id="toxicSpreader_0" src="media/svg/enemies/toxic-spreader-frame-0.svg" alt="" hidden="true">
			<img id="toxicSpreader_1" src="media/svg/enemies/toxic-spreader-frame-1.svg" alt="" hidden="true">
			<img id="toxicSpreader_0_hit" src="media/svg/enemies/toxic-spreader-frame-0-hit.svg" alt="" hidden="true">
			<img id="toxicSpreader_1_hit" src="media/svg/enemies/toxic-spreader-frame-1-hit.svg" alt="" hidden="true">
			
			<img id="doubleToxicCarrier_0" src="media/svg/enemies/double-toxic-carrier-frame-0.svg"	alt="" hidden="true">
			<img id="doubleToxicCarrier_1" src="media/svg/enemies/double-toxic-carrier-frame-1.svg"	alt="" hidden="true">
			<img id="doubleToxicCarrier_0_hit" src="media/svg/enemies/double-toxic-carrier-frame-0-hit.svg"	alt="" hidden="true">
			<img id="doubleToxicCarrier_1_hit" src="media/svg/enemies/double-toxic-carrier-frame-1-hit.svg"	alt="" hidden="true">
	
			<!-- Charges -->
		
			<img id="charge_1" src="media/svg/charges/charger-tier-1.svg" alt="" hidden="true">
			<img id="charge_2" src="media/svg/charges/charge-tier-2.svg" alt="" hidden="true">
			<img id="charge_3" src="media/svg/charges/charge-tier-3-left.svg" alt="" hidden="true">
			<img id="charge_3_right" src="media/svg/charges/charge-tier-3-right.svg" alt="" hidden="true">

			<!-- Sounds -->

			<iframe id="silence" src="media/audio/silence.mp3" allow="autoplay" style="display:none"></iframe> 

			<audio id="soundtrack" loop>
				<source src="media/audio/Galactic Marine.mp3" type="audio/mpeg">
			</audio>
			<audio autoplay id="enemy-down">
				<source src="media/audio/enemy-down.mp3" type="audio/mpeg">
			</audio>
			<audio autoplay id="enemy-has-reached-nexus">
				<source src="media/audio/enemy-reached-nexus.mp3" type="audio/mpeg">
			</audio>
			<audio autoplay id="game-over">
				<source src="media/audio/game-over.mp3" type="audio/mpeg">
			</audio>
			<audio autoplay id="new-wave-audio">
				<source src="media/audio/new-wave.mp3" type="audio/mpeg">
			</audio>
			<audio autoplay id="sound-toggle">
				<source src="media/audio/sound-control-click.mp3" type="audio/mpeg">
			</audio>
			<audio autoplay id="shot-tier-1">
				<source src="media/audio/tower-shot-tier-1.mp3" type="audio/mpeg">
			</audio>
			<audio autoplay id="shot-tier-2">
				<source src="media/audio/tower-shot-tier-2.mp3" type="audio/mpeg">
			</audio>
			<audio autoplay id="shot-tier-3">
				<source src="media/audio/tower-shot-tier-3.mp3" type="audio/mpeg">
			</audio>
		</div>
	</body>
</html>`;

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <iframe
        srcDoc={towerGameHtml}
        className="w-full h-full border-0"
        title="Tower Game"
        sandbox="allow-scripts allow-same-origin allow-forms"
      />
    </div>
  );
}
