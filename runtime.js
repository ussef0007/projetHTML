(function() {
	// Verifier si le mode d'affichage de creation de table et actif
	// Si l'on ouvre la page avec #createTable à la fin, on affiche aussi le code de création de tables
	// ex: http://localhost/ficti/#createTable
	function createTable() {
		var create = sessionStorage.getItem('createTable');
		if (create == undefined) {
			create = window.location.toString().toLowerCase().indexOf('#createtable') != -1;
			sessionStorage.setItem('createTable', create);
		}
		return create;
	}

	// Enregistre les données lorsqu'on quitte la page
	$(window).on('beforeunload', function() {
		var tables = [];
		$('.table').each(function() {
			var columns = [];
			$(this).find('.column').each(function() {
				var type = $(this).find('.column-type').val();
				var params = {};
				if (type == 'text') {
					params.size = $(this).find('.size').val();
					params.preset = $(this).find('.presets').val();
				}
				else if (type == 'seq') {
					params.start = $(this).find('.start').val();
					params.step = $(this).find('.step').val();
					params.prefix = $(this).find('.prefix').val();
					params.suffix = $(this).find('.suffix').val();
				}
				else if (type == 'decimal' || type == 'integer' || type == 'date' || type == 'datetime') {
					params.min = $(this).find('.min').val();
					params.max = $(this).find('.max').val();
				}
				else if (type == 'ref') {
					params.table = $(this).find('.table-list').val();
					params.column = $(this).find('.column-list').val();
					params.sequencial = $(this).find('.sequencial').prop('checked');
				}

				var colData = {
					id: $(this).attr('id'),
					name: $(this).find('.nom-column').val(),
					type: type,
					params: params,
					pk: $(this).find('.pk input').prop('checked'),
					isNull: $(this).find('.null input').prop('checked')
				};

				columns.push(colData);
			})

			tables.push({
				id: $(this).attr('id'),
				name: $(this).find('.nom-table').val(),
				entryCount: $(this).find('.entry-count').val(),
				columns: columns
			});
		});

		localStorage.setItem('tables', JSON.stringify(tables));
	})
	.on('load', function() {
		var tables = localStorage.getItem('tables');
		if (tables) {
			// console.log(tables);
			tables = JSON.parse(tables);
			for(var n in tables) {
				var table = tables[n];
				addTable(table.id, table.name, table.entryCount, table.columns);
			}

			updateTableSchema();

			// Update references
			for (var i in tables) {
				for (var j in tables[i].columns) {
					var col = tables[i].columns[j];
					if (col.type == 'ref') {
						var tableList = $('#' + col.id).find('.table-list');
						tableList.val(col.params.table);
						updateTableSchemaColumn(tableList);
						$('#' + col.id).find('.column-list').val(col.params.column);
					}
				} 
			}
		}
	});

	// Liste de noms pour la génération automatique
	var listeMots = ["COUNTRY", "FOUND", "ANSWER", "SCHOOL", "GROW", "STUDY", "STILL", "LEARN", "PLANT", "COVER", "FOOD", "SUN", "FOUR", "BETWEEN", "STATE", "KEEP", "EYE", "NEVER", "LAST", "LET", "THOUGHT", "CITY", "TREE", "CROSS", "FARM", "HARD", "START", "MIGHT", "STORY", "SAW", "FAR", "SEA", "DRAW", "LEFT", "LATE", "RUN", "DON'T", "WHILE", "PRESS", "CLOSE", "NIGHT", "REAL", "LIFE", "FEW", "NORTH", "OPEN", "SEEM", "TOGETHER", "NEXT", "WHITE", "CHILDREN", "BEGIN", "GOT", "WALK", "EXAMPLE", "EASE", "PAPER", "GROUP", "ALWAYS", "MUSIC", "THOSE", "BOTH", "MARK", "OFTEN", "LETTER", "UNTIL", "MILE", "RIVER", "CAR", "FEET", "CARE", "SECOND", "BOOK", "CARRY", "TOOK", "SCIENCE", "EAT", "ROOM", "FRIEND", "BEGAN", "IDEA", "FISH", "MOUNTAIN", "STOP", "ONCE", "BASE", "HEAR", "HORSE", "CUT", "SURE", "WATCH", "COLOR", "FACE", "WOOD", "MAIN", "ENOUGH", "PLAIN", "GIRL", "USUAL", "YOUNG", "READY", "ABOVE", "EVER", "RED", "LIST", "THOUGH", "FEEL", "TALK", "BIRD", "SOON", "BODY", "DOG", "FAMILY", "DIRECT", "POSE", "LEAVE", "SONG", "MEASURE", "DOOR", "PRODUCT", "BLACK", "SHORT", "NUMERAL", "CLASS", "WIND", "QUESTION", "HAPPEN", "COMPLETE", "SHIP", "AREA", "HALF", "ROCK", "ORDER", "FIRE", "SOUTH", "PROBLEM", "PIECE", "TOLD", "KNEW", "PASS", "SINCE", "TOP", "WHOLE", "KING", "SPACE", "HEARD", "BEST", "HOUR", "BETTER", "TRUE", "DURING", "HUNDRED", "FIVE", "REMEMBER", "STEP", "EARLY", "HOLD", "WEST", "GROUND", "INTEREST", "REACH", "FAST", "VERB", "SING", "LISTEN", "SIX", "TABLE", "TRAVEL", "LESS", "MORNING", "TEN", "SIMPLE", "SEVERAL", "VOWEL", "TOWARD", "WAR", "LAY", "AGAINST", "PATTERN", "SLOW", "CENTER", "LOVE", "PERSON", "MONEY", "SERVE", "APPEAR", "ROAD", "MAP", "RAIN", "RULE", "GOVERN", "PULL", "COLD", "NOTICE", "VOICE", "UNIT", "POWER", "TOWN", "FINE", "CERTAIN", "FLY", "FALL", "LEAD", "CRY", "DARK", "MACHINE", "NOTE", "WAIT", "PLAN", "FIGURE", "STAR", "BOX", "NOUN", "FIELD", "REST", "CORRECT", "ABLE", "POUND", "DONE", "BEAUTY", "DRIVE", "STOOD", "CONTAIN", "FRONT", "TEACH", "WEEK", "FINAL", "GAVE", "GREEN", "OH", "QUICK", "DEVELOP", "OCEAN", "WARM", "FREE", "MINUTE", "STRONG", "SPECIAL", "MIND", "BEHIND", "CLEAR", "TAIL", "PRODUCE", "FACT", "STREET", "INCH", "MULTIPLY", "NOTHING", "COURSE", "STAY", "WHEEL", "FULL", "FORCE", "BLUE", "OBJECT", "DECIDE", "SURFACE", "DEEP", "MOON", "ISLAND", "FOOT", "SYSTEM", "BUSY", "TEST", "RECORD", "BOAT", "COMMON", "GOLD", "POSSIBLE", "PLANE", "STEAD", "DRY", "WONDER", "LAUGH", "THOUSAND", "AGO", "RAN", "CHECK", "GAME", "SHAPE", "EQUATE", "HOT", "MISS", "BROUGHT", "HEAT", "SNOW", "TIRE", "BRING", "YES", "DISTANT", "FILL", "EAST", "PAINT", "LANGUAGE", "AMONG", "GRAND", "BALL", "YET", "WAVE", "DROP", "HEART", "AM", "PRESENT", "HEAVY", "DANCE", "ENGINE", "POSITION", "ARM", "WIDE", "SAIL", "MATERIAL", "SIZE", "VARY", "SETTLE", "SPEAK", "WEIGHT", "GENERAL", "ICE", "MATTER", "CIRCLE", "PAIR", "INCLUDE", "DIVIDE", "SYLLABLE", "FELT", "PERHAPS", "PICK", "SUDDEN", "COUNT", "SQUARE", "REASON", "LENGTH", "REPRESENT", "ART", "SUBJECT", "REGION", "ENERGY", "HUNT", "PROBABLE", "BED", "BROTHER", "EGG", "RIDE", "CELL", "BELIEVE", "FRACTION", "FOREST", "SIT", "RACE", "WINDOW", "STORE", "SUMMER", "TRAIN", "SLEEP", "PROVE", "LONE", "LEG", "EXERCISE", "WALL", "CATCH", "MOUNT", "WISH", "SKY", "BOARD", "JOY", "WINTER", "SAT", "WRITTEN", "WILD", "INSTRUMENT", "KEPT", "GLASS", "GRASS", "COW", "JOB", "EDGE", "SIGN", "VISIT", "PAST", "SOFT", "FUN", "BRIGHT", "GAS", "WEATHER", "MONTH", "MILLION", "BEAR", "FINISH", "HAPPY", "HOPE", "FLOWER", "CLOTHE", "STRANGE", "GONE", "JUMP", "BABY", "EIGHT", "VILLAGE", "MEET", "ROOT", "BUY", "RAISE", "SOLVE", "METAL", "WHETHER", "PUSH", "SEVEN", "PARAGRAPH", "THIRD", "SHALL", "HELD", "HAIR", "DESCRIBE", "COOK", "FLOOR", "EITHER", "RESULT", "BURN", "HILL", "SAFE", "CAT", "CENTURY", "CONSIDER", "TYPE", "LAW", "BIT", "COAST", "COPY", "PHRASE", "SILENT", "TALL", "SAND", "SOIL", "ROLL", "TEMPERATURE", "FINGER", "INDUSTRY", "VALUE", "FIGHT", "LIE", "BEAT", "EXCITE", "NATURAL", "VIEW", "SENSE", "EAR", "ELSE", "QUITE", "BROKE", "CASE", "MIDDLE", "KILL", "SON", "LAKE", "MOMENT", "SCALE", "LOUD", "SPRING", "OBSERVE", "CHILD", "STRAIGHT", "CONSONANT", "NATION", "DICTIONARY", "MILK", "SPEED", "METHOD", "ORGAN", "PAY", "AGE", "SECTION", "DRESS", "CLOUD", "SURPRISE", "QUIET", "STONE", "TINY", "CLIMB", "COOL", "DESIGN", "POOR", "LOT", "EXPERIMENT", "BOTTOM", "KEY", "IRON", "SINGLE", "STICK", "FLAT", "TWENTY", "SKIN", "SMILE", "CREASE", "HOLE", "TRADE", "MELODY", "TRIP", "OFFICE", "RECEIVE", "ROW", "MOUTH", "EXACT", "SYMBOL", "DIE", "LEAST", "TROUBLE", "SHOUT", "EXCEPT", "WROTE", "SEED", "TONE", "JOIN", "SUGGEST", "CLEAN", "BREAK", "LADY", "YARD", "RISE", "BAD", "BLOW", "OIL", "BLOOD", "TOUCH", "GREW", "CENT", "MIX", "TEAM", "WIRE", "COST", "LOST", "BROWN", "WEAR", "GARDEN", "EQUAL", "SENT", "CHOOSE", "FELL", "FIT", "FLOW", "FAIR", "BANK", "COLLECT", "SAVE", "CONTROL", "DECIMAL", "GENTLE", "WOMAN", "CAPTAIN", "PRACTICE", "SEPARATE", "DIFFICULT", "DOCTOR", "PLEASE", "PROTECT", "NOON", "WHOSE", "LOCATE", "RING", "CHARACTER", "INSECT", "CAUGHT", "PERIOD", "INDICATE", "RADIO", "SPOKE", "ATOM", "HUMAN", "HISTORY", "EFFECT", "ELECTRIC", "EXPECT", "CROP", "MODERN", "ELEMENT", "HIT", "STUDENT", "CORNER", "PARTY", "SUPPLY", "BONE", "RAIL", "IMAGINE", "PROVIDE", "AGREE", "THUS", "CAPITAL", "WON'T", "CHAIR", "DANGER", "FRUIT", "RICH", "THICK", "SOLDIER", "PROCESS", "OPERATE", "GUESS", "NECESSARY", "SHARP", "WING", "CREATE", "NEIGHBOR", "WASH", "BAT", "RATHER", "CROWD", "CORN", "COMPARE", "POEM", "STRING", "BELL", "DEPEND", "MEAT", "RUB", "TUBE", "FAMOUS", "DOLLAR", "STREAM", "FEAR", "SIGHT", "THIN", "TRIANGLE", "PLANET", "HURRY", "CHIEF", "COLONY", "CLOCK", "MINE", "TIE", "ENTER", "MAJOR", "FRESH", "SEARCH", "SEND", "YELLOW", "GUN", "ALLOW", "PRINT", "DEAD", "SPOT", "DESERT", "SUIT", "CURRENT", "LIFT", "ROSE", "CONTINUE", "BLOCK", "CHART", "HAT", "SELL", "SUCCESS", "COMPANY", "SUBTRACT", "EVENT", "PARTICULAR", "DEAL", "SWIM", "TERM", "OPPOSITE", "WIFE", "SHOE", "SHOULDER", "SPREAD", "ARRANGE", "CAMP", "INVENT", "COTTON", "BORN", "DETERMINE", "QUART", "NINE", "TRUCK", "NOISE", "LEVEL", "CHANCE", "GATHER", "SHOP", "STRETCH", "THROW", "SHINE", "PROPERTY", "COLUMN", "MOLECULE", "SELECT", "WRONG", "GRAY", "REPEAT", "REQUIRE", "BROAD", "PREPARE", "SALT", "NOSE", "PLURAL", "ANGER", "CLAIM", "CONTINENT", "OXYGEN", "SUGAR", "DEATH", "PRETTY", "SKILL", "WOMEN", "SEASON", "SOLUTION", "MAGNET", "SILVER", "THANK", "BRANCH", "MATCH", "SUFFIX", "ESPECIALLY", "FIG", "AFRAID", "HUGE", "SISTER", "STEEL", "DISCUSS", "FORWARD", "SIMILAR", "GUIDE", "EXPERIENCE", "SCORE", "APPLE", "BOUGHT", "LED", "PITCH", "COAT", "MASS", "CARD", "BAND", "ROPE", "SLIP", "WIN", "DREAM", "EVENING", "CONDITION", "FEED", "TOOL", "TOTAL", "BASIC", "SMELL", "VALLEY", "NOR", "DOUBLE", "SEAT", "ARRIVE", "MASTER", "TRACK", "PARENT", "SHORE", "DIVISION", "SHEET", "SUBSTANCE", "FAVOR", "CONNECT", "POST", "SPEND", "CHORD", "FAT", "GLAD", "ORIGINAL", "SHARE", "STATION", "DAD", "BREAD", "CHARGE", "PROPER", "BAR", "OFFER", "SEGMENT"];
	var listePays = ["AFGHANISTAN", "ALBANIA", "ALGERIA", "ANDORRA", "ANGOLA", "ANTIGUA & DEPS", "ARGENTINA", "ARMENIA", "AUSTRALIA", "AUSTRIA", "AZERBAIJAN", "BAHAMAS", "BAHRAIN", "BANGLADESH", "BARBADOS", "BELARUS", "BELGIUM", "BELIZE", "BENIN", "BHUTAN", "BOLIVIA", "BOSNIA HERZEGOVINA", "BOTSWANA", "BRAZIL", "BRUNEI", "BULGARIA", "BURKINA", "BURUNDI", "CAMBODIA", "CAMEROON", "CANADA", "CAPE VERDE", "CENTRAL AFRICAN REP", "CHAD", "CHILE", "CHINA", "COLOMBIA", "COMOROS", "CONGO", "CONGO {DEMOCRATIC REP}", "COSTA RICA", "CROATIA", "CUBA", "CYPRUS", "CZECH REPUBLIC", "DENMARK", "DJIBOUTI", "DOMINICA", "DOMINICAN REPUBLIC", "EAST TIMOR", "ECUADOR", "EGYPT", "EL SALVADOR", "EQUATORIAL GUINEA", "ERITREA", "ESTONIA", "ETHIOPIA", "FIJI", "FINLAND", "FRANCE", "GABON", "GAMBIA", "GEORGIA", "GERMANY", "GHANA", "GREECE", "GRENADA", "GUATEMALA", "GUINEA", "GUINEA-BISSAU", "GUYANA", "HAITI", "HONDURAS", "HUNGARY", "ICELAND", "INDIA", "INDONESIA", "IRAN", "IRAQ", "IRELAND {REPUBLIC}", "ISRAEL", "ITALY", "IVORY COAST", "JAMAICA", "JAPAN", "JORDAN", "KAZAKHSTAN", "KENYA", "KIRIBATI", "KOREA NORTH", "KOREA SOUTH", "KOSOVO", "KUWAIT", "KYRGYZSTAN", "LAOS", "LATVIA", "LEBANON", "LESOTHO", "LIBERIA", "LIBYA", "LIECHTENSTEIN", "LITHUANIA", "LUXEMBOURG", "MACEDONIA", "MADAGASCAR", "MALAWI", "MALAYSIA", "MALDIVES", "MALI", "MALTA", "MARSHALL ISLANDS", "MAURITANIA", "MAURITIUS", "MEXICO", "MICRONESIA", "MOLDOVA", "MONACO", "MONGOLIA", "MONTENEGRO", "MOROCCO", "MOZAMBIQUE", "MYANMAR, {BURMA}", "NAMIBIA", "NAURU", "NEPAL", "NETHERLANDS", "NEW ZEALAND", "NICARAGUA", "NIGER", "NIGERIA", "NORWAY", "OMAN", "PAKISTAN", "PALAU", "PANAMA", "PAPUA NEW GUINEA", "PARAGUAY", "PERU", "PHILIPPINES", "POLAND", "PORTUGAL", "QATAR", "ROMANIA", "RUSSIAN FEDERATION", "RWANDA", "ST KITTS & NEVIS", "ST LUCIA", "SAINT VINCENT & THE GRENADINES", "SAMOA", "SAN MARINO", "SAO TOME & PRINCIPE", "SAUDI ARABIA", "SENEGAL", "SERBIA", "SEYCHELLES", "SIERRA LEONE", "SINGAPORE", "SLOVAKIA", "SLOVENIA", "SOLOMON ISLANDS", "SOMALIA", "SOUTH AFRICA", "SOUTH SUDAN", "SPAIN", "SRI LANKA", "SUDAN", "SURINAME", "SWAZILAND", "SWEDEN", "SWITZERLAND", "SYRIA", "TAIWAN", "TAJIKISTAN", "TANZANIA", "THAILAND", "TOGO", "TONGA", "TRINIDAD & TOBAGO", "TUNISIA", "TURKEY", "TURKMENISTAN", "TUVALU", "UGANDA", "UKRAINE", "UNITED ARAB EMIRATES", "UNITED KINGDOM", "UNITED STATES", "URUGUAY", "UZBEKISTAN", "VANUATU", "VATICAN CITY", "VENEZUELA", "VIETNAM", "YEMEN", "ZAMBIA", "ZIMBABWE"];
	var listeVilles = ["ABERDEEN", "ABILENE", "AKRON", "ALBANY", "ALBUQUERQUE", "ALEXANDRIA", "ALLENTOWN", "AMARILLO", "ANAHEIM", "ANCHORAGE", "ANN ARBOR", "ANTIOCH", "APPLE VALLEY", "APPLETON", "ARLINGTON", "ARVADA", "ASHEVILLE", "ATHENS", "ATLANTA", "ATLANTIC CITY", "AUGUSTA", "AURORA", "AUSTIN", "BAKERSFIELD", "BALTIMORE", "BARNSTABLE", "BATON ROUGE", "BEAUMONT", "BEL AIR", "BELLEVUE", "BERKELEY", "BETHLEHEM", "BILLINGS", "BIRMINGHAM", "BLOOMINGTON", "BOISE", "BOISE CITY", "BONITA SPRINGS", "BOSTON", "BOULDER", "BRADENTON", "BREMERTON", "BRIDGEPORT", "BRIGHTON", "BROWNSVILLE", "BRYAN", "BUFFALO", "BURBANK", "BURLINGTON", "CAMBRIDGE", "CANTON", "CAPE CORAL", "CARROLLTON", "CARY", "CATHEDRAL CITY", "CEDAR RAPIDS", "CHAMPAIGN", "CHANDLER", "CHARLESTON", "CHARLOTTE", "CHATTANOOGA", "CHESAPEAKE", "CHICAGO", "CHULA VISTA", "CINCINNATI", "CLARKE COUNTY", "CLARKSVILLE", "CLEARWATER", "CLEVELAND", "COLLEGE STATION", "COLORADO SPRINGS", "COLUMBIA", "COLUMBUS", "CONCORD", "CORAL SPRINGS", "CORONA", "CORPUS CHRISTI", "COSTA MESA", "DALLAS", "DALY CITY", "DANBURY", "DAVENPORT", "DAVIDSON COUNTY", "DAYTON", "DAYTONA BEACH", "DELTONA", "DENTON", "DENVER", "DES MOINES", "DETROIT", "DOWNEY", "DULUTH", "DURHAM", "EL MONTE", "EL PASO", "ELIZABETH", "ELK GROVE", "ELKHART", "ERIE", "ESCONDIDO", "EUGENE", "EVANSVILLE", "FAIRFIELD", "FARGO", "FAYETTEVILLE", "FITCHBURG", "FLINT", "FONTANA", "FORT COLLINS", "FORT LAUDERDALE", "FORT SMITH", "FORT WALTON BEACH", "FORT WAYNE", "FORT WORTH", "FREDERICK", "FREMONT", "FRESNO", "FULLERTON", "GAINESVILLE", "GARDEN GROVE", "GARLAND", "GASTONIA", "GILBERT", "GLENDALE", "GRAND PRAIRIE", "GRAND RAPIDS", "GRAYSLAKE", "GREEN BAY", "GREENBAY", "GREENSBORO", "GREENVILLE", "GULFPORT-BILOXI", "HAGERSTOWN", "HAMPTON", "HARLINGEN", "HARRISBURG", "HARTFORD", "HAVRE DE GRACE", "HAYWARD", "HEMET", "HENDERSON", "HESPERIA", "HIALEAH", "HICKORY", "HIGH POINT", "HOLLYWOOD", "HONOLULU", "HOUMA", "HOUSTON", "HOWELL", "HUNTINGTON", "HUNTINGTON BEACH", "HUNTSVILLE", "INDEPENDENCE", "INDIANAPOLIS", "INGLEWOOD", "IRVINE", "IRVING", "JACKSON", "JACKSONVILLE", "JEFFERSON", "JERSEY CITY", "JOHNSON CITY", "JOLIET", "KAILUA", "KALAMAZOO", "KANEOHE", "KANSAS CITY", "KENNEWICK", "KENOSHA", "KILLEEN", "KISSIMMEE", "KNOXVILLE", "LACEY", "LAFAYETTE", "LAKE CHARLES", "LAKELAND", "LAKEWOOD", "LANCASTER", "LANSING", "LAREDO", "LAS CRUCES", "LAS VEGAS", "LAYTON", "LEOMINSTER", "LEWISVILLE", "LEXINGTON", "LINCOLN", "LITTLE ROCK", "LONG BEACH", "LORAIN", "LOS ANGELES", "LOUISVILLE", "LOWELL", "LUBBOCK", "MACON", "MADISON", "MANCHESTER", "MARINA", "MARYSVILLE", "MCALLEN", "MCHENRY", "MEDFORD", "MELBOURNE", "MEMPHIS", "MERCED", "MESA", "MESQUITE", "MIAMI", "MILWAUKEE", "MINNEAPOLIS", "MIRAMAR", "MISSION VIEJO", "MOBILE", "MODESTO", "MONROE", "MONTEREY", "MONTGOMERY", "MORENO VALLEY", "MURFREESBORO", "MURRIETA", "MUSKEGON", "MYRTLE BEACH", "NAPERVILLE", "NAPLES", "NASHUA", "NASHVILLE", "NEW BEDFORD", "NEW HAVEN", "NEW LONDON", "NEW ORLEANS", "NEW YORK", "NEW YORK CITY", "NEWARK", "NEWBURGH", "NEWPORT NEWS", "NORFOLK", "NORMAL", "NORMAN", "NORTH CHARLESTON", "NORTH LAS VEGAS", "NORTH PORT", "NORWALK", "NORWICH", "OAKLAND", "OCALA", "OCEANSIDE", "ODESSA", "OGDEN", "OKLAHOMA CITY", "OLATHE", "OLYMPIA", "OMAHA", "ONTARIO", "ORANGE", "OREM", "ORLANDO", "OVERLAND PARK", "OXNARD", "PALM BAY", "PALM SPRINGS", "PALMDALE", "PANAMA CITY", "PASADENA", "PATERSON", "PEMBROKE PINES", "PENSACOLA", "PEORIA", "PHILADELPHIA", "PHOENIX", "PITTSBURGH", "PLANO", "POMONA", "POMPANO BEACH", "PORT ARTHUR", "PORT ORANGE", "PORT SAINT LUCIE", "PORT ST. LUCIE", "PORTLAND", "PORTSMOUTH", "POUGHKEEPSIE", "PROVIDENCE", "PROVO", "PUEBLO", "PUNTA GORDA", "RACINE", "RALEIGH", "RANCHO CUCAMONGA", "READING", "REDDING", "RENO", "RICHLAND", "RICHMOND", "RICHMOND COUNTY", "RIVERSIDE", "ROANOKE", "ROCHESTER", "ROCKFORD", "ROSEVILLE", "ROUND LAKE BEACH", "SACRAMENTO", "SAGINAW", "SAINT LOUIS", "SAINT PAUL", "SAINT PETERSBURG", "SALEM", "SALINAS", "SALT LAKE CITY", "SAN ANTONIO", "SAN BERNARDINO", "SAN BUENAVENTURA", "SAN DIEGO", "SAN FRANCISCO", "SAN JOSE", "SANTA ANA", "SANTA BARBARA", "SANTA CLARA", "SANTA CLARITA", "SANTA CRUZ", "SANTA MARIA", "SANTA ROSA", "SARASOTA", "SAVANNAH", "SCOTTSDALE", "SCRANTON", "SEASIDE", "SEATTLE", "SEBASTIAN", "SHREVEPORT", "SIMI VALLEY", "SIOUX CITY", "SIOUX FALLS", "SOUTH BEND", "SOUTH LYON", "SPARTANBURG", "SPOKANE", "SPRINGDALE", "SPRINGFIELD", "ST. LOUIS", "ST. PAUL", "ST. PETERSBURG", "STAMFORD", "STERLING HEIGHTS", "STOCKTON", "SUNNYVALE", "SYRACUSE", "TACOMA", "TALLAHASSEE", "TAMPA", "TEMECULA", "TEMPE", "THORNTON", "THOUSAND OAKS", "TOLEDO", "TOPEKA", "TORRANCE", "TRENTON", "TUCSON", "TULSA", "TUSCALOOSA", "TYLER", "UTICA", "VALLEJO", "VANCOUVER", "VERO BEACH", "VICTORVILLE", "VIRGINIA BEACH", "VISALIA", "WACO", "WARREN", "WASHINGTON", "WATERBURY", "WATERLOO", "WEST COVINA", "WEST VALLEY CITY", "WESTMINSTER", "WICHITA", "WILMINGTON", "WINSTON", "WINTER HAVEN", "WORCESTER", "YAKIMA", "YONKERS", "YORK", "YOUNGSTOWN"];
	var listePrenoms = ['JAMES', 'JOHN', 'ROBERT', 'MICHAEL', 'MARY', 'WILLIAM', 'DAVID', 'RICHARD', 'CHARLES', 'JOSEPH', 'THOMAS', 'PATRICIA', 'CHRISTOPHER', 'LINDA', 'BARBARA', 'DANIEL', 'PAUL', 'MARK', 'ELIZABETH', 'DONALD', 'JENNIFER', 'GEORGE', 'MARIA', 'KENNETH', 'SUSAN', 'STEVEN', 'EDWARD', 'MARGARET', 'BRIAN', 'RONALD', 'DOROTHY', 'ANTHONY', 'LISA', 'KEVIN', 'NANCY', 'KAREN', 'BETTY', 'HELEN', 'JASON', 'MATTHEW', 'GARY', 'TIMOTHY', 'SANDRA', 'JOSE', 'LARRY', 'JEFFREY', 'FRANK', 'DONNA', 'CAROL', 'RUTH', 'SCOTT', 'ERIC', 'STEPHEN', 'ANDREW', 'SHARON', 'MICHELLE', 'LAURA', 'SARAH', 'KIMBERLY', 'DEBORAH', 'JESSICA', 'RAYMOND', 'SHIRLEY', 'CYNTHIA', 'ANGELA', 'MELISSA', 'BRENDA', 'AMY', 'JERRY', 'GREGORY', 'ANNA', 'JOSHUA', 'VIRGINIA', 'REBECCA', 'KATHLEEN', 'DENNIS', 'PAMELA', 'MARTHA', 'DEBRA', 'AMANDA', 'WALTER', 'STEPHANIE', 'WILLIE', 'PATRICK', 'TERRY', 'CAROLYN', 'PETER', 'CHRISTINE', 'MARIE', 'JANET', 'FRANCES', 'CATHERINE', 'HAROLD', 'HENRY', 'DOUGLAS', 'JOYCE', 'ANN', 'DIANE', 'ALICE', 'JEAN', 'JULIE'];
	var listeNoms = ['SMITH', 'JOHNSON', 'WILLIAMS', 'JONES', 'BROWN', 'DAVIS', 'MILLER', 'WILSON', 'MOORE', 'TAYLOR', 'ANDERSON', 'THOMAS', 'JACKSON', 'WHITE', 'HARRIS', 'MARTIN', 'THOMPSON', 'GARCIA', 'MARTINEZ', 'ROBINSON', 'CLARK', 'RODRIGUEZ', 'LEWIS', 'LEE', 'WALKER', 'HALL', 'ALLEN', 'YOUNG', 'HERNANDEZ', 'KING', 'WRIGHT', 'LOPEZ', 'HILL', 'SCOTT', 'GREEN', 'ADAMS', 'BAKER', 'GONZALEZ', 'NELSON', 'CARTER', 'MITCHELL', 'PEREZ', 'ROBERTS', 'TURNER', 'PHILLIPS', 'CAMPBELL', 'PARKER', 'EVANS', 'EDWARDS', 'COLLINS', 'STEWART', 'SANCHEZ', 'MORRIS', 'ROGERS', 'REED', 'COOK', 'MORGAN', 'BELL', 'MURPHY', 'BAILEY', 'RIVERA', 'COOPER', 'RICHARDSON', 'COX', 'HOWARD', 'WARD', 'TORRES', 'PETERSON', 'GRAY', 'RAMIREZ', 'JAMES', 'WATSON', 'BROOKS', 'KELLY', 'SANDERS', 'PRICE', 'BENNETT', 'WOOD', 'BARNES', 'ROSS', 'HENDERSON', 'COLEMAN', 'JENKINS', 'PERRY', 'POWELL', 'LONG', 'PATTERSON', 'HUGHES', 'FLORES', 'WASHINGTON', 'BUTLER', 'SIMMONS', 'FOSTER', 'GONZALES', 'BRYANT', 'ALEXANDER', 'RUSSELL', 'GRIFFIN', 'DIAZ', 'HAYES', 'MYERS', 'FORD', 'HAMILTON', 'GRAHAM', 'SULLIVAN', 'WALLACE', 'WOODS', 'COLE', 'WEST', 'JORDAN', 'OWENS', 'REYNOLDS', 'FISHER', 'ELLIS', 'HARRISON', 'GIBSON', 'MCDONALD', 'CRUZ', 'MARSHALL', 'ORTIZ', 'GOMEZ', 'MURRAY', 'FREEMAN', 'WELLS', 'WEBB', 'SIMPSON', 'STEVENS', 'TUCKER', 'PORTER', 'HUNTER', 'HICKS', 'CRAWFORD', 'HENRY', 'BOYD', 'MASON', 'MORALES', 'KENNEDY', 'WARREN', 'DIXON', 'RAMOS', 'REYES', 'BURNS', 'GORDON', 'SHAW', 'HOLMES', 'RICE', 'ROBERTSON', 'HUNT', 'BLACK', 'DANIELS', 'PALMER', 'MILLS', 'NICHOLS', 'GRANT', 'KNIGHT', 'FERGUSON', 'ROSE', 'STONE', 'HAWKINS', 'DUNN', 'PERKINS', 'HUDSON', 'SPENCER', 'GARDNER', 'STEPHENS', 'PAYNE', 'PIERCE', 'BERRY', 'MATTHEWS', 'ARNOLD', 'WAGNER', 'WILLIS', 'RAY', 'WATKINS', 'OLSON', 'CARROLL', 'DUNCAN', 'SNYDER', 'HART', 'CUNNINGHAM', 'BRADLEY', 'LANE', 'ANDREWS', 'RUIZ', 'HARPER', 'FOX', 'RILEY', 'ARMSTRONG', 'CARPENTER', 'WEAVER', 'GREENE', 'LAWRENCE', 'ELLIOTT', 'CHAVEZ', 'SIMS', 'AUSTIN', 'PETERS', 'KELLEY', 'FRANKLIN', 'LAWSON', 'FIELDS', 'GUTIERREZ', 'RYAN', 'SCHMIDT', 'CARR', 'VASQUEZ', 'CASTILLO', 'WHEELER', 'CHAPMAN', 'OLIVER', 'MONTGOMERY', 'RICHARDS', 'WILLIAMSON', 'JOHNSTON', 'BANKS', 'MEYER', 'BISHOP', 'MCCOY', 'HOWELL', 'ALVAREZ', 'MORRISON', 'HANSEN', 'FERNANDEZ', 'GARZA', 'HARVEY', 'LITTLE', 'BURTON', 'STANLEY', 'NGUYEN', 'GEORGE', 'JACOBS', 'REID', 'KIM', 'FULLER', 'LYNCH', 'DEAN', 'GILBERT', 'GARRETT', 'ROMERO', 'WELCH', 'LARSON', 'FRAZIER', 'BURKE', 'HANSON', 'DAY', 'MENDOZA', 'MORENO', 'BOWMAN', 'MEDINA', 'FOWLER', 'BREWER', 'HOFFMAN', 'CARLSON', 'SILVA', 'PEARSON', 'HOLLAND', 'DOUGLAS', 'FLEMING', 'JENSEN', 'VARGAS', 'BYRD', 'DAVIDSON', 'HOPKINS', 'MAY', 'TERRY', 'HERRERA', 'WADE', 'SOTO', 'WALTERS', 'CURTIS', 'NEAL', 'CALDWELL', 'LOWE', 'JENNINGS', 'BARNETT', 'GRAVES', 'JIMENEZ', 'HORTON', 'SHELTON', 'BARRETT', 'OBRIEN', 'CASTRO', 'SUTTON', 'GREGORY', 'MCKINNEY', 'LUCAS', 'MILES', 'CRAIG', 'RODRIQUEZ', 'CHAMBERS', 'HOLT', 'LAMBERT', 'FLETCHER', 'WATTS', 'BATES', 'HALE', 'RHODES', 'PENA', 'BECK', 'NEWMAN', 'HAYNES', 'MCDANIEL', 'MENDEZ', 'BUSH', 'VAUGHN', 'PARKS', 'DAWSON', 'SANTIAGO', 'NORRIS', 'HARDY', 'LOVE', 'STEELE', 'CURRY', 'POWERS', 'SCHULTZ', 'BARKER', 'GUZMAN', 'PAGE', 'MUNOZ', 'BALL', 'KELLER', 'CHANDLER', 'WEBER', 'LEONARD', 'WALSH', 'LYONS', 'RAMSEY', 'WOLFE', 'SCHNEIDER', 'MULLINS', 'BENSON', 'SHARP', 'BOWEN', 'DANIEL', 'BARBER', 'CUMMINGS', 'HINES', 'BALDWIN', 'GRIFFITH', 'VALDEZ', 'HUBBARD', 'SALAZAR', 'REEVES', 'WARNER', 'STEVENSON', 'BURGESS', 'SANTOS', 'TATE', 'CROSS', 'GARNER', 'MANN', 'MACK', 'MOSS', 'THORNTON', 'DENNIS', 'MCGEE', 'FARMER', 'DELGADO', 'AGUILAR', 'VEGA', 'GLOVER', 'MANNING', 'COHEN', 'HARMON', 'RODGERS', 'ROBBINS', 'NEWTON', 'TODD', 'BLAIR', 'HIGGINS', 'INGRAM', 'REESE', 'CANNON', 'STRICKLAND', 'TOWNSEND', 'POTTER', 'GOODWIN', 'WALTON', 'ROWE', 'HAMPTON', 'ORTEGA', 'PATTON', 'SWANSON', 'JOSEPH', 'FRANCIS', 'GOODMAN', 'MALDONADO', 'YATES', 'BECKER', 'ERICKSON', 'HODGES', 'RIOS', 'CONNER', 'ADKINS', 'WEBSTER', 'NORMAN', 'MALONE', 'HAMMOND', 'FLOWERS', 'COBB', 'MOODY', 'QUINN', 'BLAKE', 'MAXWELL', 'POPE', 'FLOYD', 'OSBORNE', 'PAUL', 'MCCARTHY', 'GUERRERO', 'LINDSEY', 'ESTRADA', 'SANDOVAL', 'GIBBS', 'TYLER', 'GROSS', 'FITZGERALD', 'STOKES', 'DOYLE', 'SHERMAN', 'SAUNDERS', 'WISE', 'COLON', 'GILL', 'ALVARADO', 'GREER', 'PADILLA', 'SIMON', 'WATERS', 'NUNEZ', 'BALLARD', 'SCHWARTZ', 'MCBRIDE', 'HOUSTON', 'CHRISTENSEN', 'KLEIN', 'PRATT', 'BRIGGS', 'PARSONS', 'MCLAUGHLIN', 'ZIMMERMAN', 'FRENCH', 'BUCHANAN', 'MORAN', 'COPELAND', 'ROY', 'PITTMAN', 'BRADY', 'MCCORMICK', 'HOLLOWAY', 'BROCK', 'POOLE', 'FRANK', 'LOGAN', 'OWEN', 'BASS', 'MARSH', 'DRAKE', 'WONG', 'JEFFERSON', 'PARK', 'MORTON', 'ABBOTT', 'SPARKS', 'PATRICK', 'NORTON', 'HUFF', 'CLAYTON', 'MASSEY', 'LLOYD', 'FIGUEROA', 'CARSON', 'BOWERS', 'ROBERSON', 'BARTON', 'TRAN', 'LAMB', 'HARRINGTON', 'CASEY', 'BOONE', 'CORTEZ', 'CLARKE', 'MATHIS', 'SINGLETON', 'WILKINS', 'CAIN', 'BRYAN', 'UNDERWOOD', 'HOGAN', 'MCKENZIE', 'COLLIER', 'LUNA', 'PHELPS', 'MCGUIRE', 'ALLISON', 'BRIDGES', 'WILKERSON'];

	// Selectionner les éléments modèles, les detacher, supprimer leurs ids et la classe 'hidden'
	var columnElem = $('#column-elem').detach().removeAttr('id').removeClass('hidden');
	var tableElem = $('#table-elem').detach().removeAttr('id').removeClass('hidden');
	var textOptionsElem = $('#text-options-elem').detach().removeAttr('id').removeClass('hidden');
	var seqOptionsElem = $('#seq-options-elem').detach().removeAttr('id').removeClass('hidden');
	var integerOptionsElem = $('#integer-options-elem').detach().removeAttr('id').removeClass('hidden');
	var decimalOptionsElem = $('#decimal-options-elem').detach().removeAttr('id').removeClass('hidden');
	var dateOptionsElem = $('#date-options-elem').detach().removeAttr('id').removeClass('hidden');
	var dateTimeOptionsElem = $('#datetime-options-elem').detach().removeAttr('id').removeClass('hidden');
	var refOptionsElem = $('#ref-options-elem').detach().removeAttr('id').removeClass('hidden');

	var optionElem = {
		'text': textOptionsElem,
		'seq': seqOptionsElem,
		'integer': integerOptionsElem,
		'decimal': decimalOptionsElem,
		'date': dateOptionsElem,
		'datetime': dateTimeOptionsElem,
		'ref': refOptionsElem
	};

	var tableIdCount = 0;
	var columnIdCount = 0;

	// Fonction d'aide pour générer un nombre aléatoire dans une intervale
	function rand(min, max) {
		return min + Math.random() * (max - min);
	}

	// Fonction d'aide pour ajouter des zéros au début des nombres
	function pad(n, width) {
		n = n + ''; // to string
		while (n.length < width) n = '0' + n;
		return n;
	}

	// Fonction pour ajouter une nouvelle table
	function addTable(id, name, entryCount, cols) {
		tableIdCount++;

		name = name || 'Table_' + tableIdCount;
		id = id || 'tab-' + tableIdCount; 

		var table = tableElem.clone()
			.attr('id', id)
			.appendTo('#tables');

		table.find('.nom-table').val(name);
		table.find('.entry-count').val(entryCount || ~~rand(10, 100));

		if (cols) {
			for(var i in cols) {
				var col = cols[i];
				addColumn(table, col.id, col.name, col.type, col.params, col.pk, col.isNull)
			}
		}

		return table;
	}

	// Fonction pour ajouter un nouvelle colomn à l'élément table donné
	function addColumn(table, id, name, type, params, pk, isNull) {
		columnIdCount++;

		name = columnName = name || "Column_" + columnIdCount;
		id = id || 'col-' + columnIdCount;

		var col = columnElem.clone()
			.attr('id', id)
			.appendTo(table.find('.columns'));

		type = type || 'text';

		col.find('.nom-column').val(name);
		col.find('.column-type').val(type);
		if (pk !== undefined) col.find('.pk input').prop('checked', pk);
		if (isNull !== undefined) col.find('.null input').prop('checked', isNull);

		if (pk === true) {
			col.find('.null input').prop('disabled', true);
		}

		col.find('.col-3').append(optionElem[type].clone());

		if (params) {
			if (type == 'text') {
				col.find('.size').val(params.size);
				col.find('.presets').val(params.preset);
			}
			else if (type == 'seq') {
				col.find('.start').val(params.start);
				col.find('.step').val(params.step);
				col.find('.prefix').val(params.prefix);
				col.find('.suffix').val(params.suffix);
			}
			else if (type == 'decimal' || type == 'integer' || type == 'date' || type == 'datetime') {
				col.find('.min').val(params.min);
				col.find('.max').val(params.max);
			}
			// else if (type == 'ref') {
			// 	var tableList = col.find('.table-list');
			// 	tableList.val(params.table);
			// 	col.find('.column-list').val(params.column);
			// 	col.find('.sequencial').prop('checked', params.sequencial);

			// }
		}
	}

	// Fonction appelée à chaque ajout/suppressier de tables ou de colonnes
	function updateTableSchema(tableList) {
		tableList = tableList || $('.table-list');
		tableList.each(function() {
			var self = $(this);
			var currVal = self.val();
			self.empty();

			$('.table').each(function() {
				var name = $(this).find('.nom-table').val();
				var id = $(this).attr('id');

				tableList.append($('<option/>').text(name).val(id));
			});

			if (currVal) self.val(currVal);
			if (self.val() == null) self.val(self.children().eq(0).val());

			updateTableSchemaColumn(self);
		});
	}

	// Fonction appelée à chaque changement de table dans un dropdown .table-list
	function updateTableSchemaColumn(tableList, reinitVal) {
		var colList = tableList.siblings('.column-list');
		var currVal = colList.val();
		colList.empty();

		var table = $('#' + tableList.val());
		var currentColumnId = tableList.parents('.column').attr('id');

		table.find('.column').each(function() {
			var name = $(this).find('.nom-column').val();
			var id = $(this).attr('id');

			// Ajouter que les colonnes differentes de la colonne actuelle
			if (id != currentColumnId) {
				colList.append($('<option/>').text(name).val(id));
			}
		});

		if (currVal && !reinitVal) colList.val(currVal);
		if (colList.val() == null) colList.val(colList.children().eq(0).val());
	}

	// Retourne le type d'une colonne dont l'ID est donne
	function getColumnType(id) {
		var column = $('#' + id);
		var type = column.find('.column-type').val();

		if (type == 'ref') {
			var referenced = column.find('.column-list').val();

			if (referenced) return getColumnType(referenced);
		} 
		else if (type == 'text') {
			var taille = column.find('.size').val();
			if (taille == '0') {
				return 'TEXT';
			}
			else {
				return 'VARCHAR(' + taille + ')';
			}
		}
		else if (type == 'seq') {
			var prefixe = column.find('.prefix').val() || '';
			var suffixe = column.find('.suffix').val() || '';
			if (prefixe == '' && suffixe == '') {
				return 'INT';
			}
			else {
				return 'VARCHAR(' + (11 + prefixe.length + suffixe.length) + ')';
			}
		}
		else if (type == 'decimal') {
			return 'REAL';
		}
		else if (type == 'integer') {
			return 'INT';
		}
		else if (type == 'date') {
			return 'DATE';
		}
		else if (type == 'datetime') {
			return 'DATETIME';
		}

		return '<UNDEFINED>';
	}

	// Determine si la colonne donnee est une reference ou pas
	function isReference(col) {
		if (col.find('.column-type').val() == 'ref') {
			return col.find('.column-list').val();
		}

		return undefined;
	}

	// Genère des donnees pour text
	function textGen(count, size, preset) {
		var entries = new Array(count);

		// Gérer le cas de size = 0 (aka TEXT)
		if (size == 0) size = 100;

		for (var i = 0; i < count; ++i) {
			var text;
			if (preset == 'nom') {
				if (size < 8) throw 'Le type de texte NOM nécessite un varchar d\'au moins 8 lettres';

				do {
					text = listeNoms[~~rand(0, listeNoms.length - 1)];
				}
				while (text.length >= size);
			}
			else if (preset == 'prenom') {
				if (size < 8) throw 'Le type de texte PRÉNOM nécessite un varchar d\'au moins 8 lettres';

				do {
					text = listeNoms[~~rand(0, listePrenoms.length - 1)];
				}
				while (text.length >= size);
			}
			else if (preset == 'pays') {
				if (size < 10) throw 'Le type de texte PAYS nécessite un varchar d\'au moins 10 lettres';
				do {
					text = listePays[~~rand(0, listePays.length - 1)];
				}
				while (text.length >= size);
			}
			else if (preset == 'villes') {
				if (size < 10) throw 'Le type de texte VILLES nécessite un varchar d\'au moins 10 lettres';
				do {
					text = listeVilles[~~rand(0, listeVilles.length - 1)];
				}
				while (text.length >= size);
			}
			else if (preset == 'mots') {
				if (size < 10) throw 'Le type de texte MOTS nécessite un varchar d\'au moins 10 lettres';
				do {
					text = listeMots[~~rand(0, listeVilles.length - 1)];
				}
				while (text.length >= size);
			}
			else if (preset == 'random') {
				var strLength = ~~rand(1, size-1);
				text = '';
				for (var j = 0; j < strLength; ++j) {
					var charCode = ~~rand(65, 98);
					text += charCode > 90 ? ' ' : String.fromCharCode(charCode);
				}

				text = text.trim();
			}
			else {
				text = '';
			}

			entries[i] = "'" + text + "'";
		}

		return entries;
	}

	// Genère une séquence
	function seqGen(count, start, step, prefix, suffix) {
		var entries = new Array(count);

		var isString = prefix.length != 0 || suffix.length != 0;
		for (var i = 0; i < count; ++i) {
			entries[i] = (isString ? "'" : '') + prefix + (start + i*step) + suffix + (isString ? "'" : '');
		}

		return entries;
	}

	// Genère des nombres décimaux dans une intérvale
	function floatGen(count, min, max) {
		var entries = new Array(count);

		for (var i = 0; i < count; ++i) {
			entries[i] = rand(min, max);
		}

		return entries;
	}

	// Genère des nombers décimaux entiers dans une intérvale
	function intGen(count, min, max) {
		var entries = new Array(count);

		for (var i = 0; i < count; ++i) {
			entries[i] = ~~rand(min, max);
		}

		return entries;
	}

	// Genère des dates entre 2 intérvales
	function dateGen(count, min, max) {
		var entries = new Array(count);

		for (var i = 0; i < count; ++i) {
			var date = new Date(+min + ~~(Math.random() * (max - min)));
			entries[i] = "'" + pad(date.getMonth(), 2) + "/" + pad(date.getDate(), 2) + "/" + pad((1900 + date.getYear()), 4) + "'";
		}

		return entries;
	}

	function dateTimeGen(count, min, max) {
		var entries = new Array(count);

		for (var i = 0; i < count; ++i) {
			var date = new Date(+min + ~~(Math.random() * (max - min)));
			entries[i] = "'" + pad(date.getMonth(), 2) + "/" + pad(date.getDate(), 2) + "/" + pad((1900 + date.getYear()), 4)
				+ ' ' + pad(date.getHours(), 2) + ':' + pad(date.getMinutes(), 2) + ':' + pad(date.getSeconds(), 2) + "'";
		}

		return entries;
	}

	function refGen(current, count, tableID, columnID, sequencial, isNull, isPk) {
		var entries = new Array(count);

		var targetTable = $('#' + tableID);
		var targetColumn = $('#' + columnID);
		var targetEntryCount = parseInt(targetTable.find('.entry-count').val());

		if (isPk && count > targetEntryCount) {
			throw 'Le nombre des éléments referencés par une clé primaire doit être supérieur au nombre d\'éléments générés';
		}

		var idx = targetColumn.index();

		if (sequencial) {
			for (var i = 0; i < count; ++i) {
				entries[i] = current[tableID][idx][i % targetEntryCount];
			}
		}
		else if (isPk) {
			// Si clé primaire faut méler les valeurs référencés de façon unique
			entries = current[tableID][idx].slice(0, count);

			var currIndex = count, tempVal, randomIndex;

			while (currIndex > 0) {
				randomIndex = Math.floor(Math.random() * currIndex--);

				tempVal = entries[currIndex];
				entries[currIndex] = entries[randomIndex];
				entries[randomIndex] = tempVal;
			}
		}
		else {
			for (var i = 0; i < count; ++i) {
				var index = ~~rand(0, targetEntryCount * ((isNull && !isPk) ? 2 : 1));
				entries[i] = (index >= current[tableID][idx].length) ? 'NULL' : current[tableID][idx][index];
			}
		}

		return entries;
	}

	// Genère des données selon le type
	function contentGen(currentEntries, column, count) {
		var type = column.find('.column-type').val();

		// Pour chaque colonne on genere N enregistrements
		if (type == 'text') {
			var size = column.find('.size').val();
			var preset = column.find('.presets').val();

			return textGen(count, size, preset);
		}
		else if(type == 'seq') {
			var start = parseInt(column.find('.start').val() || 1);
			var step = parseInt(column.find('.step').val() || 1);
			var prefix = column.find('.prefix').val() || '';
			var suffix = column.find('.suffix').val() || '';

			return seqGen(count, start, step, prefix, suffix);
		}
		else if(type == 'decimal') {
			var min = parseFloat(column.find('.min').val() || 0);
			var max = parseFloat(column.find('.max').val() || 1);

			return floatGen(count, min, max);
		}
		else if (type == 'integer') {
			var min = parseInt(column.find('.min').val() || 0);
			var max = parseInt(column.find('.max').val() || 0);

			return intGen(count, min, max);
		}
		else if (type == 'date') {
			var min = column.find('.min').val();
			var max = column.find('.max').val();

			return dateGen(count, (min == '') ? new Date() : new Date(min), (max == '') ? new Date() : new Date(max));
		}
		else if (type == 'datetime') {
			var min = column.find('.min').val();
			var max = column.find('.max').val();

			return dateTimeGen(count, (min == '') ? new Date() : new Date(min), (max == '') ? new Date() : new Date(max));
		}
		else if (type == 'ref') {
			var refTable = column.find('.table-list').val();
			var refCol = column.find('.column-list').val();
			var sequencial = column.find('.sequencial').prop('checked');
			var isNull = column.find('.null input').prop('checked');
			var isPk = column.find('.pk input').prop('checked');

			return refGen(currentEntries, count, refTable, refCol, sequencial, isNull, isPk);
		}
		else {
			return [];
		}
	}

	// Évènements
	$(document).on('click', '.add-table', function() {
		addTable();
		updateTableSchema();
		return false;
	})
	.on('click', '.reset', function() {
		var r = confirm('Êtes-vous sûre de vouloir réinitialiser tout?');

		if (r === true) {
			$('#tables').empty();
			$('#output').empty();
			tableIdCount = 0;
			columnIdCount = 0;
		}
	})
	.on('click', '.add-column', function() {
		addColumn($(this).parents('.table'));
		updateTableSchema();
		return false;
	})
	.on('change', '.column-type', function() {
		var type = $(this).val();
		var elem = optionElem[type].clone();
		$(this).parents('tr').find('.col-3').empty().append(elem);
		if (type == 'ref') updateTableSchema(elem.find('.table-list'));
	})
	.on('change', '.nom-table', function() {
		updateTableSchema();
	})
	.on('change', '.nom-column', function() {
		
		// Selectionner les elements .table-list correspondants à la table actuelle
		var idTable = $(this).parents('.table').attr('id');
		$('.table-list').filter(function() {
			return $(this).val() == idTable;
		}).each(function() {
			updateTableSchemaColumn($(this));
		});
	})
	.on('change', '.table-list', function() {
		updateTableSchemaColumn($(this), true);
	})
	.on('change', '.pk input', function() {
		$(this).parents('.column').find('.null input').prop('disabled', $(this).prop('checked'));
	})
	.on('click', '.remove-table', function() {
		$(this).parents('.table').remove();
		updateTableSchema();
	})
	.on('click', '.column .remove a', function() {
		var col = $(this).parents('.column');
		var idTable = col.parents('.table').attr('id');
		
		col.remove();

		$('.table-list').filter(function() {
			return $(this).val() == idTable;
		}).each(function() {
			updateTableSchemaColumn($(this));
		});
	})
	.on('click', '.col-up', function() {
		var col = $(this).parents('.column');
		var prev = col.prev();
		col.detach().insertBefore(prev);

		var idTable = col.parents('.table').attr('id');
		$('.table-list').filter(function() {
			return $(this).val() == idTable;
		}).each(function() {
			updateTableSchemaColumn($(this));
		});
	})
	.on('click', '.col-down', function() {
		var col = $(this).parents('.column');
		var next = col.next();
		col.detach().insertAfter(next);
		
		var idTable = col.parents('.table').attr('id');
		$('.table-list').filter(function() {
			return $(this).val() == idTable;
		}).each(function() {
			updateTableSchemaColumn($(this));
		});
	})
	.on('click', '.build', function() {
		try {
			var output = '';

			var references = {};

			$('#tables .table').each(function() {
				var table = $(this);

				var nom = table.find('.nom-table').val();

				var pks = []; // La liste des clés primaires

				// On enregistre les noms des colonnes ici
				var columns = [];

				table.find('.column').each(function() {
					var nom = $(this).find('.nom-column').val();
					var type = getColumnType($(this).attr('id'));

					var notNull = !$(this).find('.null input').prop('checked');

					// Si clé primaire ajouter à la liste des clés primaires de la table
					if ($(this).find('.pk input').prop('checked')) {
						pks.push(nom);
						notNull = true;
					}

					var outputStr = '&nbsp;&nbsp;&nbsp;&nbsp;' + nom + ' ' + type;
					if (notNull) outputStr += ' NOT NULL';
					columns.push(outputStr);

					// Ajouter a la liste des references si reference
					var referencedCol = isReference($(this));
					if (referencedCol != undefined) {
						references[$(this).attr('id')] = referencedCol;
					}
				});

				if (columns.length == 0) return;

				if (createTable()) {
					output += 'CREATE TABLE ' + nom + ' (\n' + columns.join(',\n');

					if (pks.length > 0) {
						output += ',\n&nbsp;&nbsp;&nbsp;&nbsp;CONSTRAINT pk_' + nom + ' PRIMARY KEY(' + pks.join(', ') + ')';
					}

					output += '\n)\n\n';
				}
			});

			// Ajouter les constrantes de références et générer une table de dépendances
			var dependencies = {};
			for (var colId in references) {
				col = $('#' + colId);

				var table = col.parents('.table');
				var tableName = table.find('.nom-table').val();
				var columnName = col.find('.nom-column').val();

				var referencedColumn = $('#' + references[colId]);
				var referencedTable = referencedColumn.parents('.table');
				var referencedTableName = referencedTable.find('.nom-table').val();
				var referencedColumnName = referencedColumn.find('.nom-column').val();

				var depTable = dependencies[tableName];
				if (!depTable) {
					depTable = [];
					dependencies[table.attr('id')] = depTable;
				}
				depTable.push(referencedTable.attr('id'));

				if (createTable()) {
					output += 'ALTER TABLE ' + tableName + '\n';
					output += 'ADD CONSTRAINT fk_' + tableName + '_' + columnName + ' FOREIGN KEY(' + columnName
						+ ') REFERENCES ' + referencedTableName + '(' + referencedColumnName + ') \n\n';
				}
			}

			// Trier les tables par dépendances (celles sans dépendances vient avant)
			var depList = [];
			$('.table').each(function() {
				depList.push($(this).attr('id'));
			});
			depList = depList.sort(function(a, b) {
				return (dependencies[a] && dependencies[a].indexOf(b) != -1) ? 1 : -1;
			});

			// On genère les donnés à insérer
			var entries = {};
			for (var n in depList) {
				var tableID = depList[n];
				var table = $('#' + tableID);

				// On genere les enregistrements par table
				var tableEntries = [];
				entries[tableID] = tableEntries;

				var entryCount = table.find('.entry-count').val();

				//
				var columnsPending = [];

				table.find('.column').each(function() {

					if (
						$(this).find('.column-type').val() == 'ref'
						&& $(this).find('.table-list').val() == tableID
						&& $(this).index() < $('#' + $(this).find('.column-list').val()).index()
					) {
						columnsPending.push($(this).index());
						tableEntries.push([]);
					}
					else {
						tableEntries.push(contentGen(entries, $(this), entryCount));
					}
				});

				do {
					var newPendingList = [];
					for (var i in columnsPending) {
						var col = table.find('.column').eq(i);

						if (
							col.find('.column-type').val() == 'ref'
							&& col.find('.table-list').val() == tableID
							&& columnsPending[$('#' + col.find('.column-list').val()).index()] != undefined
						) {
							newPendingList.push(col.index());
						}
						else {
							tableEntries[col.index()] = contentGen(entries, col, entryCount);
						}
					}

					columnsPending = newPendingList;
				}
				while (columnsPending.length > 0)
			}

			for (var n in depList) {
				var tableID = depList[n];

				var table = $('#' + tableID);
				var tableName = table.find('.nom-table').val();
				var entryCount = table.find('.entry-count').val();

				// Ne rien faire dans cette itération s'il n'y a aucune donnée à générer
				if (entryCount == 0 || entries[tableID].length == 0) continue;

				output += 'INSERT INTO ' + tableName + ' VALUES\n&nbsp;&nbsp;&nbsp;&nbsp;';

				var entryList = [];
				for (var i = 0; i < entryCount; ++i) {
					var entry = [];

					var colList = entries[tableID];
					for (var j in colList) {
						entry.push(colList[j][i]);
					}

					entryList.push('(' + entry.join(', ') + ')');
				}

				output += entryList.join(',\n&nbsp;&nbsp;&nbsp;&nbsp;') + '\n\n';
			}

			$('#output').html(output);
		}
		catch(err) {
			if (err instanceof RangeError) {
				alert('Une erreur a survenu :\n' + err + '\n\nVérifiez s\'il y a un cycle de références.');
			}
			else {
				alert('Une erreur a survenu :\n' + err);
			}
		}
	});
})();