import { PrismaClient, Prisma } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // ── Glossary (50 terms) ──────────────────────────────────────────────────
  const glossaryTerms = [
    { term: "Akathist", slug: "akathist", definition: "A form of hymn sung standing (a-kathisma, 'not sitting'). The most famous is the Akathist to the Theotokos, sung on the fifth Saturday of Great Lent. Akathists are composed to Christ, the Theotokos, and various saints.", relatedTerms: ["Theotokos", "Kontakion"] },
    { term: "Analogion", slug: "analogion", definition: "A wooden lectern or stand in the church on which icons, the Gospel book, or service books are placed. It is the focal point from which readers and chanters lead the services.", relatedTerms: ["Proskomedia", "Narthex"] },
    { term: "Antidoron", slug: "antidoron", definition: "Literally 'instead of the gift.' The blessed (but not consecrated) bread distributed to the faithful — and to non-Orthodox visitors — at the end of the Divine Liturgy. It is the remainder of the prosphoron from which the Lamb was cut.", relatedTerms: ["Prosphoron", "Prosphora", "Divine Liturgy"] },
    { term: "Apophatic Theology", slug: "apophatic-theology", definition: "Also called 'negative theology' (theologia negativa). The approach to speaking about God by denying what He is not, rather than making positive assertions. Because God transcends all categories, apophatic theology guards against reducing Him to human concepts. Paired with cataphatic (positive) theology.", relatedTerms: ["Theosis", "Essence and Energies"] },
    { term: "Apostolic Succession", slug: "apostolic-succession", definition: "The unbroken chain of episcopal ordination from the Apostles to the present. Orthodox bishops trace their ordination lineage through an uninterrupted series of laying on of hands back to the Apostles themselves, ensuring the continuity of sacramental life and authoritative teaching in the Church.", relatedTerms: ["Episcopate", "Holy Orders"] },
    { term: "Artos", slug: "artos", definition: "A large leavened loaf blessed at Pascha and carried in procession throughout Bright Week. On Bright Saturday it is broken and distributed to the faithful. The artos bears the image of the Resurrection.", relatedTerms: ["Pascha", "Prosphora"] },
    { term: "Catechumen", slug: "catechumen", definition: "A person who is preparing to receive baptism and chrismation into the Orthodox Church. In ancient practice, catechumens attended the first part of the Liturgy (the Liturgy of the Catechumens) and were dismissed before the Liturgy of the Faithful. The period of preparation is called catechesis.", relatedTerms: ["Chrismation", "Baptism", "Divine Liturgy"] },
    { term: "Chrismation", slug: "chrismation", definition: "The sacrament by which the newly baptized receives the gift of the Holy Spirit through anointing with Holy Chrism. It is the 'seal of the gift of the Holy Spirit' and completes baptism. Orthodox Christians who are received from other traditions may also receive chrismation.", relatedTerms: ["Baptism", "Holy Chrism", "Catechumen"] },
    { term: "Deacon", slug: "deacon", definition: "The third order of ordained clergy (below bishop and priest). Deacons assist at the Liturgy, proclaim the Gospel, lead the litanies, and serve at the altar. A married man may be ordained deacon; the diaconate may also be permanent (not leading to priesthood).", relatedTerms: ["Holy Orders", "Priest", "Bishop"] },
    { term: "Divine Liturgy", slug: "divine-liturgy", definition: "The central act of Orthodox worship and the celebration of the Eucharist. The most common form is the Liturgy of St. John Chrysostom; the longer Liturgy of St. Basil the Great is served on ten occasions during the year. The Liturgy of the Presanctified Gifts (attributed to St. Gregory Dialogos) is served on weekday evenings of Great Lent.", relatedTerms: ["Eucharist", "Proskomedia", "Antidoron"] },
    { term: "Ecumenical Council", slug: "ecumenical-council", definition: "A council of bishops gathered from the whole Church to settle matters of doctrine and discipline. Orthodoxy recognizes seven Ecumenical Councils: Nicaea I (325), Constantinople I (381), Ephesus (431), Chalcedon (451), Constantinople II (553), Constantinople III (680-81), and Nicaea II (787). Their dogmatic definitions are binding for the whole Church.", relatedTerms: ["Apostolic Succession", "Holy Tradition"] },
    { term: "Epitrachelion", slug: "epitrachelion", definition: "The stole worn by a priest around the neck and hanging down the front, symbolizing the grace of the Holy Spirit and the yoke of Christ. It is the primary vestment of the priesthood; a priest may not celebrate any sacrament without it.", relatedTerms: ["Orarion", "Holy Orders"] },
    { term: "Essence and Energies", slug: "essence-and-energies", definition: "The theological distinction articulated by St. Gregory Palamas (14th c.) between God's unknowable and incommunicable divine essence (ousia) and His uncreated, communicable divine energies (energeiai). We can never participate in God's essence but we truly participate in His energies — real divine life, not a created gift. This distinction safeguards both the divine transcendence and the genuine deification (theosis) of humanity.", relatedTerms: ["Theosis", "Apophatic Theology", "Gregory Palamas"] },
    { term: "Eucharist", slug: "eucharist", definition: "The sacrament of the Body and Blood of Christ, celebrated in the Divine Liturgy. Orthodox theology affirms the real presence of Christ — His Body and Blood truly present in the consecrated bread and wine — without defining the manner of change through scholastic categories like 'transubstantiation.' The Eucharist is the center and summit of the Church's life.", relatedTerms: ["Divine Liturgy", "Proskomedia", "Real Presence"] },
    { term: "Exarchate", slug: "exarchate", definition: "A territorial unit of the Orthodox Church administered by an exarch, typically a bishop who acts as the representative of a patriarch in a distant region. The term is also used historically for certain semi-autonomous ecclesiastical provinces.", relatedTerms: ["Patriarch", "Diocese"] },
    { term: "Feast of Feasts", slug: "feast-of-feasts", definition: "A title given to Pascha (Easter), distinguishing it above all other feasts. The Paschal troparion — 'Christ is risen from the dead, trampling down death by death, and upon those in the tombs bestowing life' — is the central proclamation of the Orthodox faith.", relatedTerms: ["Pascha", "Troparion"] },
    { term: "Great Lent", slug: "great-lent", definition: "The forty-day period of fasting, prayer, and repentance preceding Holy Week and Pascha. It begins on Clean Monday. The fast involves abstaining from meat, dairy, fish, oil, and wine on most days. It is the most intense fasting period of the Orthodox year.", relatedTerms: ["Pascha", "Fasting", "Holy Week"] },
    { term: "Great Schism", slug: "great-schism", definition: "The formal break between the Eastern (Orthodox) and Western (Roman Catholic) Churches, traditionally dated to 1054, when mutual excommunications were exchanged between Patriarch Michael Cerularius of Constantinople and Cardinal Humbert, legate of Pope Leo IX. The schism had deep theological, political, and cultural roots going back centuries.", relatedTerms: ["Patriarch", "Ecumenical Council", "Papacy"] },
    { term: "Hesychasm", slug: "hesychasm", definition: "From the Greek hesychia ('stillness, quiet'). A tradition of contemplative prayer in Orthodox monasticism, particularly associated with the monks of Mt. Athos and theologized by St. Gregory Palamas. It involves inner stillness, the Jesus Prayer, and the vision of the divine light (the uncreated light of Tabor).", relatedTerms: ["Jesus Prayer", "Essence and Energies", "Theosis"] },
    { term: "Holy Chrism", slug: "holy-chrism", definition: "The sacred oil (myron) blessed by a patriarch or synod of bishops and used for the sacrament of chrismation. It contains olive oil mixed with numerous aromatic substances and is prepared and blessed according to ancient rites. Parishes receive Holy Chrism from their mother church.", relatedTerms: ["Chrismation", "Patriarch"] },
    { term: "Holy Orders", slug: "holy-orders", definition: "The sacrament by which men are ordained to the episcopate (bishop), presbyterate (priest), or diaconate (deacon). Ordination is conferred by the laying on of hands by a bishop. Only bishops may ordain. The Orthodox Church distinguishes between major orders (bishop, priest, deacon) and minor orders (subdeacon, reader).", relatedTerms: ["Bishop", "Priest", "Deacon"] },
    { term: "Holy Tradition", slug: "holy-tradition", definition: "The living transmission of the fullness of the Christian faith through the ages — including Scripture, the Creeds, the canons of the Councils, the liturgical texts, the writings of the Fathers, and the lived faith of the Church. For Orthodoxy, Scripture exists within Tradition rather than above it; the Church is the context in which Scripture is rightly interpreted.", relatedTerms: ["Scripture", "Ecumenical Council", "Sola Scriptura"] },
    { term: "Homoousios", slug: "homoousios", definition: "Greek: 'of one essence/substance.' The term adopted by the Council of Nicaea (325) to define the relationship of the Son to the Father — not merely similar in nature (homoiousios) but identical in essence. The term is the theological heart of the Nicene Creed and the defeat of Arianism.", relatedTerms: ["Nicene Creed", "Trinity", "Arianism"] },
    { term: "Icon", slug: "icon", definition: "From the Greek eikon, 'image.' A sacred image of Christ, the Theotokos, saints, angels, or events of sacred history. Orthodox theology, defined at the Seventh Ecumenical Council (Nicaea II, 787), holds that the honor given to an icon passes to its prototype — the person depicted — not to the material image itself. Icons are windows into the Kingdom, not merely devotional art.", relatedTerms: ["Iconostasis", "Seventh Council", "Theotokos"] },
    { term: "Iconostasis", slug: "iconostasis", definition: "The screen of icons that separates the nave (where the faithful stand) from the sanctuary (altar area) in an Orthodox church. It typically consists of several rows of icons arranged in a traditional order, with the Royal Doors at the center. The iconostasis is not a wall that hides the altar but a boundary that both separates and unites the heavenly and earthly realms.", relatedTerms: ["Icon", "Royal Doors", "Sanctuary"] },
    { term: "Jesus Prayer", slug: "jesus-prayer", definition: "The prayer 'Lord Jesus Christ, Son of God, have mercy on me, a sinner.' It is the foundational prayer of the hesychast tradition, prayed continuously — often with a prayer rope (chotki) — as a form of unceasing prayer (cf. 1 Thess. 5:17). The prayer combines invocation of the Name of Jesus with the cry of the blind man (Luke 18:38) and the publican (Luke 18:13).", relatedTerms: ["Hesychasm", "Prayer Rope", "Theosis"] },
    { term: "Kontakion", slug: "kontakion", definition: "A short liturgical hymn that summarizes the theological content of a feast or a saint's life. The kontakion is one of the two principal troparia of a feast (the other being the troparion). The most famous kontakion is the first of the Akathist to the Theotokos: 'To you, the Champion Leader...'", relatedTerms: ["Troparion", "Akathist", "Theotokos"] },
    { term: "Leavened Bread", slug: "leavened-bread", definition: "Orthodox liturgical practice uses leavened bread (artos) for the Eucharist, in contrast to the Western use of unleavened wafers. The leavened bread is seen as a symbol of the risen Christ. This difference in practice was one of the tensions between East and West in the period before the Great Schism.", relatedTerms: ["Eucharist", "Prosphora", "Great Schism"] },
    { term: "Liturgy of the Presanctified Gifts", slug: "presanctified-gifts", definition: "An evening service celebrated on Wednesdays and Fridays of Great Lent in which the faithful receive Holy Communion from gifts consecrated at a previous Sunday Liturgy. It is attributed to St. Gregory the Dialogist (Pope Gregory the Great) and is characterized by great solemnity and penitential beauty.", relatedTerms: ["Great Lent", "Divine Liturgy", "Eucharist"] },
    { term: "Metropolis", slug: "metropolis", definition: "An ecclesiastical province headed by a metropolitan bishop (metropolitan). In Orthodox ecclesiology, the metropolitan presides over a group of dioceses in a region, and the bishop of the chief city (metropolis) of the province holds this dignity. Each autocephalous or autonomous church may be organized into metropolises.", relatedTerms: ["Diocese", "Bishop", "Patriarch"] },
    { term: "Myrrh-bearers", slug: "myrrh-bearers", definition: "The women who came to the tomb of Christ on the morning of the Resurrection to anoint His body with myrrh (Mark 16:1). The Sunday of the Myrrh-bearing Women is the third Sunday after Pascha. They are venerated as 'equal to the Apostles.'", relatedTerms: ["Pascha", "Equal to the Apostles"] },
    { term: "Narthex", slug: "narthex", definition: "The vestibule or entrance hall of an Orthodox church, preceding the nave. In ancient practice, catechumens and penitents stood in the narthex. Today it often serves as a transition space between the outside world and the nave. Some services (e.g., certain Lenten services) begin in the narthex.", relatedTerms: ["Catechumen", "Nave", "Iconostasis"] },
    { term: "Nicene Creed", slug: "nicene-creed", definition: "The Symbol of Faith, formulated at the Councils of Nicaea (325) and Constantinople (381) and accepted as the definitive statement of Orthodox Christian belief. The Orthodox form does not include the Filioque clause ('and from the Son') added by the Western church, which is a point of dogmatic division between Orthodoxy and Rome.", relatedTerms: ["Ecumenical Council", "Filioque", "Trinity"] },
    { term: "Orarion", slug: "orarion", definition: "The liturgical vestment of a deacon — a long narrow stole worn over the left shoulder. The subdeacon wears it crossed over the back in an X pattern. During the Liturgy the deacon lifts the orarion to direct the congregation in prayer ('Let us attend,' 'Stand aright').", relatedTerms: ["Epitrachelion", "Deacon", "Holy Orders"] },
    { term: "Palamism", slug: "palamism", definition: "The theological tradition associated with St. Gregory Palamas (1296-1359) and his defense of hesychast prayer and the distinction between God's essence and energies. The Palamite theology was affirmed by a series of councils in Constantinople (1341, 1347, 1351) and is considered a dogmatic definition of the Orthodox Church.", relatedTerms: ["Essence and Energies", "Hesychasm", "Gregory Palamas"] },
    { term: "Panagia", slug: "panagia", definition: "Literally 'All-Holy.' A title of the Theotokos (Virgin Mary). Also refers to a small icon of the Theotokos worn as a pectoral medallion by bishops. In monasteries, the 'raising of the Panagia' is a blessing of bread in honor of the Theotokos at meals.", relatedTerms: ["Theotokos", "Icon", "Bishop"] },
    { term: "Pascha", slug: "pascha", definition: "The Orthodox celebration of the Resurrection of Christ — called Easter in the West. Pascha is the 'Feast of Feasts,' the center of the Orthodox liturgical year. It is preceded by Holy Week and followed by the Paschal season (Bright Week and the forty days to Ascension). The date is calculated by the Julian calendar in most Orthodox churches.", relatedTerms: ["Holy Week", "Great Lent", "Feast of Feasts"] },
    { term: "Patriarch", slug: "patriarch", definition: "The title of the bishop who presides over one of the ancient or major autocephalous churches: Constantinople, Alexandria, Antioch, Jerusalem, Moscow, Serbia, Romania, Bulgaria, Georgia, and others. The Ecumenical Patriarch of Constantinople holds a primacy of honor (not jurisdiction) among all Orthodox patriarchs.", relatedTerms: ["Autocephaly", "Bishop", "Ecumenical Council"] },
    { term: "Phronema", slug: "phronema", definition: "Greek: 'mindset, disposition, way of thinking.' The Orthodox phronema is the mind of the Church — the way of perceiving reality, interpreting Scripture, and living the faith that is characteristic of the Orthodox tradition. It is not merely an intellectual position but a whole orientation of life formed by prayer, fasting, and the sacraments.", relatedTerms: ["Holy Tradition", "Theosis"] },
    { term: "Prayer Rope", slug: "prayer-rope", definition: "A knotted rope (Russian: chotki; Greek: komboskini) used to count repetitions of the Jesus Prayer. The traditional form has 100 knots, each tied with a series of crosses. Its use is not restricted to monks; many Orthodox Christians use a prayer rope in their daily rule of prayer.", relatedTerms: ["Jesus Prayer", "Hesychasm"] },
    { term: "Proskomedia", slug: "proskomedia", definition: "The service of preparation at the beginning of the Divine Liturgy, performed by the priest in the side chapel (prothesis) of the sanctuary. The priest cuts the Lamb (the eucharistic bread) from the prosphoron and prepares commemorations for the living and the dead on the diskos (paten). The proskomedia is a rich liturgy of intercession rarely seen by the faithful.", relatedTerms: ["Divine Liturgy", "Prosphora", "Diskos"] },
    { term: "Prosphora", slug: "prosphora", definition: "Leavened eucharistic bread baked for use in the Divine Liturgy. The main prosphoron (loaf) provides the Lamb; other small loaves are used for commemorations of the living and the dead during the proskomedia. The faithful may bring prosphora and submit names for commemoration.", relatedTerms: ["Proskomedia", "Divine Liturgy", "Antidoron"] },
    { term: "Relics", slug: "relics", definition: "The bodily remains of saints, venerated in the Orthodox Church as holy because the body participated in the divine life and will be resurrected. The placing of relics in the altar table (antimins) is required for the celebration of the Liturgy. Relics are sources of grace and intercession, as attested by miracles.", relatedTerms: ["Saints", "Icon", "Antimins"] },
    { term: "Royal Doors", slug: "royal-doors", definition: "The central doors of the iconostasis, leading from the nave into the sanctuary. They bear icons of the Annunciation and the four Evangelists. The Royal Doors are opened and closed at specific points in the Liturgy; only clergy may pass through them. They symbolize the gates of Paradise.", relatedTerms: ["Iconostasis", "Sanctuary", "Divine Liturgy"] },
    { term: "Sobornost", slug: "sobornost", definition: "A Russian theological concept, developed by Alexei Khomiakov, meaning 'conciliarity' or 'togetherness in unity.' It describes the organic unity of the Church — not a unity of external authority (as in Rome) nor of individual interpretation (as in Protestantism) but a unity of shared life in the Holy Spirit, expressed in the councils of the Church.", relatedTerms: ["Ecumenical Council", "Holy Tradition"] },
    { term: "Theosis", slug: "theosis", definition: "Deification — the process by which a human person participates in the divine life and nature (2 Pet. 1:4). This is the telos (goal) of the Christian life. St. Athanasius expressed it: 'God became man so that man might become god.' Theosis does not mean absorption into God or loss of personal identity; it means genuine participation in God's uncreated energies.", relatedTerms: ["Essence and Energies", "Hesychasm", "Apophatic Theology"] },
    { term: "Theotokos", slug: "theotokos", definition: "Greek: 'God-bearer' or 'Birth-giver of God.' The title given to the Virgin Mary, affirmed at the Council of Ephesus (431) against Nestorius, who preferred Christotokos ('Christ-bearer'). The title is a Christological statement: it affirms that the one born of Mary is truly God, not merely a human person indwelt by the divine. She is the greatest of all saints.", relatedTerms: ["Virgin Mary", "Panagia", "Ephesus"] },
    { term: "Trisagion", slug: "trisagion", definition: "The 'Thrice-Holy' hymn: 'Holy God, Holy Mighty, Holy Immortal, have mercy on us.' Sung three times at many points in the Orthodox services. In the Divine Liturgy it is sung before the Epistle reading. In Christology the Trisagion refers to the Trinity; some have understood each clause as referring to each Person.", relatedTerms: ["Divine Liturgy", "Trinity"] },
    { term: "Troparion", slug: "troparion", definition: "The principal hymn of a feast or a saint, summarizing the theological content of the celebration. Each day of the liturgical calendar has a troparion. The tone (one of eight tones in the octoechos) of the troparion determines the melodic mode.", relatedTerms: ["Kontakion", "Octoechos", "Feast"] },
    { term: "Typikon", slug: "typikon", definition: "The liturgical rulebook of an Orthodox church, prescribing the order of services, the assignment of Scripture readings, hymns, and fasting rules for each day of the year. Different Typikonat (Jerusalem, Studite, Athonite) have influenced different local traditions. The Typikon ensures the unity and consistency of Orthodox worship across centuries.", relatedTerms: ["Divine Liturgy", "Great Lent", "Fasting"] },
  ]

  for (const term of glossaryTerms) {
    await prisma.glossaryTerm.upsert({
      where: { slug: term.slug },
      update: term,
      create: term,
    })
  }
  console.log(`✓ ${glossaryTerms.length} glossary terms seeded`)

  // ── Pillars ──────────────────────────────────────────────────────────────
  const pillarsData = [
    { slug: "scripture-and-tradition", title: "Scripture & Holy Tradition", description: "How Orthodoxy reads the Bible within the living Tradition; the canon, typology, the Church Fathers as interpreters, and the relationship between Scripture and Tradition.", order: 1 },
    { slug: "liturgy-and-sacraments", title: "Liturgy & the Sacraments", description: "The Divine Liturgy walked through step by step; baptism, chrismation, Eucharist, confession, marriage, ordination, and unction.", order: 2 },
    { slug: "church-history", title: "Church History", description: "Apostolic succession through the seven Ecumenical Councils; the Great Schism; the history of the Church into the modern world.", order: 3 },
    { slug: "theology", title: "Theology", description: "The Holy Trinity, Christology, the Incarnation, theosis, the essence/energies distinction, and apophatic theology.", order: 4 },
    { slug: "saints-icons-veneration", title: "Saints, Icons & Veneration", description: "The theology of the icon defined at the Seventh Council, the communion of saints, the Theotokos, and the veneration of relics.", order: 5 },
    { slug: "prayer-and-fasting", title: "Prayer Life & Fasting", description: "The Jesus Prayer, daily prayer rule, the prayer rope, the fasting seasons, and almsgiving as the three ascetic pillars.", order: 6 },
    { slug: "early-church-fathers", title: "The Early Church Fathers", description: "Guided readings from Ignatius of Antioch, Athanasius, the Cappadocians, John Chrysostom, Maximus the Confessor, and John of Damascus.", order: 7 },
  ]

  const pillars: Record<string, any> = {}
  for (const p of pillarsData) {
    pillars[p.slug] = await prisma.pillar.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    })
  }
  console.log(`✓ ${pillarsData.length} pillars seeded`)

  // ── Scripture & Tradition — Courses ─────────────────────────────────────
  const pillarId = pillars["scripture-and-tradition"].id

  const inquirerCourse = await prisma.course.upsert({
    where: { id: "course-scripture-inquirer" },
    update: {
      title: "Scripture & Holy Tradition — Inquirer",
      description: "An introduction to how the Orthodox Church reads Scripture within the living Tradition. We explore the question 'where did the Bible come from?' and 'who has the authority to interpret it?'",
      track: "INQUIRER",
      order: 1,
    },
    create: {
      id: "course-scripture-inquirer",
      pillarId,
      title: "Scripture & Holy Tradition — Inquirer",
      description: "An introduction to how the Orthodox Church reads Scripture within the living Tradition. We explore the question 'where did the Bible come from?' and 'who has the authority to interpret it?'",
      track: "INQUIRER",
      order: 1,
    },
  })

  const catechumenCourse = await prisma.course.upsert({
    where: { id: "course-scripture-catechumen" },
    update: {
      title: "Scripture & Holy Tradition — Catechumen",
      description: "A deeper formation in the Orthodox approach to Scripture, the Fathers, and Tradition. Includes close readings of patristic texts and engagement with the questions that the catechumen will carry into their life as a communicant.",
      track: "CATECHUMEN",
      order: 2,
    },
    create: {
      id: "course-scripture-catechumen",
      pillarId,
      title: "Scripture & Holy Tradition — Catechumen",
      description: "A deeper formation in the Orthodox approach to Scripture, the Fathers, and Tradition. Includes close readings of patristic texts and engagement with the questions that the catechumen will carry into their life as a communicant.",
      track: "CATECHUMEN",
      order: 2,
    },
  })

  // ── Inquirer Lessons ─────────────────────────────────────────────────────
  const inquirerLessons = [
    {
      id: "lesson-inq-scripture-1",
      slug: "what-is-the-bible-for-orthodox-christians",
      title: "What Is the Bible for Orthodox Christians?",
      order: 1,
      estimatedMinutes: 18,
      contentMdx: `<p class="drop-cap">The Orthodox Church loves the Scriptures. Every Divine Liturgy is saturated with them — the Psalms, the Epistles, the Gospels, the prophets. An Orthodox Christian who attends services regularly hears more Scripture read aloud in a year than most readers cover in private study. The Bible is not a foreign document to Orthodoxy; it is the Church's own book.</p>

<p>But Orthodoxy holds the Scriptures differently than many Western Christians, particularly those from Protestant traditions. To understand that difference, we need to ask a prior question: what, exactly, is the Bible?</p>

<h2>A collection, not a single volume</h2>

<p>The word <em>Bible</em> comes from the Greek <em>ta biblia</em> — "the books." Scripture is a library: sixty-six books in the Protestant canon, seventy-three in the Roman Catholic, and more still in the Orthodox. The Orthodox Old Testament canon is broader than the Protestant one, including books like Tobit, Judith, 1 and 2 Maccabees, the Wisdom of Solomon, Sirach, and others — what Protestants call the "Apocrypha" but Orthodoxy calls the "deuterocanonical" books. These books were part of the Septuagint (LXX), the Greek translation of the Hebrew Scriptures used by the New Testament authors and the early Church.</p>

<p>The New Testament canon — the twenty-seven books — was not formally settled until the late fourth century, through the deliberations of local councils and the consensus of the Church. No single verse of Scripture authorizes the canon; the canon is itself a product of Tradition.</p>

<h2>The Church gave us the Bible</h2>

<p>This is the point that surprises many newcomers to Orthodoxy. Orthodox theology insists that the Church — the Body of Christ animated by the Holy Spirit — produced, preserved, and authorized the Scriptures. The New Testament documents were written by members of the Church, for the Church, in the context of the Church's worship and mission. The canon was recognized (not created) by the Church over centuries of use, prayer, and discernment.</p>

<p>This means that for Orthodoxy, the Church is not subordinate to Scripture as an authority above it. Rather, Scripture and the Church exist in a relationship of mutual belonging. To read Scripture rightly, one reads it within the Body that bore it.</p>

<blockquote>
<p>"The Church does not submit itself to Scripture as to a higher authority, but rather the Church recognizes in Scripture its own witness about itself."<br/>— Fr. Georges Florovsky, <em>Bible, Church, Tradition: An Eastern Orthodox View</em> (1972), p. 45.</p>
</blockquote>

<h2>What this is not saying</h2>

<p>This is not a claim that the Church invented Scripture or that Church authority is arbitrary. It is a historical claim: the twenty-seven books of the New Testament were selected, not from the sky, but through the actual living process of the Christian community. And it is a theological claim: the same Holy Spirit who inspired the authors also guided the community in recognizing those texts as authoritative.</p>

<hr class="ornament"/>

<details class="border border-[var(--border)] my-6">
  <summary class="px-4 py-3 text-xs font-sans uppercase tracking-wider text-[var(--text-secondary)] cursor-pointer hover:text-[var(--accent)] transition-colors">If you are coming from a Protestant background</summary>
  <div class="px-5 py-4 text-sm font-sans text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)]">
    <p>You may be wondering: doesn't this make the Church's authority higher than the Bible's? Many Protestants were taught that <em>sola scriptura</em> — Scripture alone as the final authority — protects against human corruption of doctrine. That concern is understandable.</p>
    <p class="mt-3">Orthodox theology's answer is that <em>sola scriptura</em> as a formal principle is itself a post-Reformation doctrine, not a teaching of the early Church. The Fathers never pitted Scripture against Tradition; they assumed they were the same thing — the same Holy Spirit speaking through both. The question "what does the Bible alone say, apart from Tradition?" would have been puzzling to Justin Martyr, Irenaeus, or Athanasius. Scripture was always read in church, by the community, with the Fathers as guides.</p>
  </div>
</details>

<h2>A book for the liturgy, a book for life</h2>

<p>In Orthodox practice, Scripture is primarily encountered in worship. The Psalter is prayed through in its entirety each week in monastic communities. The Gospels are read standing, with incense, in solemn procession. The Epistles are chanted. Scripture is not merely a text to be analyzed; it is the word of God spoken, sung, and received in the assembly of the faithful.</p>

<p>This liturgical context shapes Orthodox interpretation. The Church Fathers who comment on Scripture are themselves soaked in the liturgy. Their exegesis assumes that the reader has heard these texts prayed, not merely studied.</p>`,
      readingAssignment: "Read the Prologue to the Gospel of John (John 1:1–18) slowly, twice. Then read the opening of 1 John (1 John 1:1–4). Notice what both texts say about 'the beginning' and about witness. What does it mean that the Word became flesh?",
      jurisdictionNotes: {
        OCA: "The OCA uses the New King James Version (NKJV) and the New Revised Standard Version (NRSV) in its official translations of the services, though parishes vary. The Septuagint numbering of the Psalms differs from the Hebrew numbering used in most Protestant Bibles — Psalm 22 (Hebrew) is Psalm 21 (LXX).",
        GOARCH: "The Greek Orthodox Archdiocese uses the New Revised Standard Version (NRSV) in its official English-language liturgical texts. The Archdiocese's Archons and parishes in America often use bilingual editions of the New Testament.",
        ANTIOCHIAN: "The Antiochian Archdiocese commonly uses the King James Version in its liturgical life. The Archdiocese has deep ties to the liturgical tradition of the Church of Antioch, one of the original apostolic sees.",
        ROCOR: "The Russian Orthodox Church Outside Russia tends to use translations that reflect the Church Slavonic and Russian Orthodox tradition. The Septuagint text is emphasized, following the Russian tradition.",
      },
      quiz: {
        questions: [
          {
            id: "q1",
            question: "What does the Greek word 'ta biblia' (the origin of 'Bible') mean?",
            options: ["The Holy Book", "The books", "The Word of God", "The writings of Moses"],
            correctIndex: 1,
            explanation: "Bible comes from the Greek 'ta biblia,' meaning simply 'the books' — a library, not a single volume.",
          },
          {
            id: "q2",
            question: "The Orthodox canon of the Old Testament is broader than the Protestant canon because it includes books from:",
            options: ["The Latin Vulgate exclusively", "The Septuagint (Greek) translation used by the early Church", "A later medieval council", "The Hebrew Masoretic text only"],
            correctIndex: 1,
            explanation: "Orthodoxy includes the deuterocanonical books of the Septuagint — the Greek translation used by the New Testament authors and the early Church.",
          },
          {
            id: "q3",
            question: "In Orthodox theology, the relationship between Scripture and the Church is best described as:",
            options: ["Scripture is the final authority over the Church", "The Church created Scripture arbitrarily", "Scripture and Church belong together; the Church recognized and preserved Scripture", "They are completely separate authorities"],
            correctIndex: 2,
            explanation: "Orthodoxy holds that the Church and Scripture exist in a relationship of mutual belonging — the Church bore Scripture, and Scripture bears witness to the Church's faith.",
          },
        ],
      },
    },
    {
      id: "lesson-inq-scripture-2",
      slug: "holy-tradition-what-it-is-and-is-not",
      title: "Holy Tradition: What It Is and Is Not",
      order: 2,
      estimatedMinutes: 22,
      contentMdx: `<p class="drop-cap">The word <em>Tradition</em> makes many Protestant-background seekers nervous. It sounds like "mere human customs" — the sort of thing that Jesus criticized the Pharisees for placing above the commandments of God (Mark 7:8). But the Tradition that Orthodoxy confesses is something quite different from human customs that have accumulated over time.</p>

<h2>Tradition with a capital T</h2>

<p>Orthodox theology distinguishes between Holy Tradition — the living transmission of the fullness of the Christian faith — and human traditions (small t), which are customs, practices, and disciplines that may change over time. Holy Tradition is the life of the Holy Spirit in the Church. It includes:</p>

<ul style="list-style: disc; padding-left: 1.5em; margin-bottom: 1em;">
<li style="margin-bottom: 0.5em;">The Holy Scriptures themselves</li>
<li style="margin-bottom: 0.5em;">The Nicene-Constantinopolitan Creed</li>
<li style="margin-bottom: 0.5em;">The dogmatic decrees of the Seven Ecumenical Councils</li>
<li style="margin-bottom: 0.5em;">The canons governing Church order</li>
<li style="margin-bottom: 0.5em;">The liturgical texts (the Divine Liturgy, the services of the hours, the festal cycle)</li>
<li style="margin-bottom: 0.5em;">The writings of the Church Fathers</li>
<li style="margin-bottom: 0.5em;">The lived faith of the saints — icons, devotional life, the practice of prayer</li>
</ul>

<p>All of these are expressions of one reality: the Holy Spirit dwelling in the Church and guiding it into all truth (John 16:13).</p>

<h2>Tradition as memory and life</h2>

<p>Vladimir Lossky, one of the great Orthodox theologians of the twentieth century, defined Tradition as "the life of the Holy Spirit in the Church, communicating to each member of the Body of Christ the faculty of hearing, of receiving, of knowing the Truth in the Light which belongs to it, and not according to the natural light of human reason."</p>

<p>This is not tradition as museum piece. It is Tradition as living organism. The Church does not merely preserve documents from the past; it inhabits the same life that the apostles received and transmits that life across the centuries.</p>

<blockquote>
<p>"Tradition is the constant abiding of the Spirit and not only the memory of words."<br/>— Fr. Georges Florovsky, <em>Bible, Church, Tradition</em>, p. 46.</p>
</blockquote>

<h2>The Fathers as interpreters</h2>

<p>A crucial element of Tradition is the consensus of the Church Fathers — the great theologians, bishops, and saints of the first millennium. When Orthodox Christians want to know what a passage of Scripture means, they do not begin from zero with their own reading. They ask: what did the Fathers — the men who lived closest to the apostolic era, who died for the faith, who were filled with the Holy Spirit — understand this text to mean?</p>

<p>This is not a slavish appeal to authority. It is the recognition that Christian interpretation has a history, and that history carries weight. As St. Vincent of Lérins wrote in the fifth century: "We hold that faith which has been believed everywhere, always, and by all" — the rule of antiquity, universality, and consent.</p>

<hr class="ornament"/>

<details class="border border-[var(--border)] my-6">
  <summary class="px-4 py-3 text-xs font-sans uppercase tracking-wider text-[var(--text-secondary)] cursor-pointer hover:text-[var(--accent)] transition-colors">If you are coming from a Protestant background</summary>
  <div class="px-5 py-4 text-sm font-sans text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border)]">
    <p>You may be wondering: isn't Scripture sufficient? Why do we need Tradition in addition to the Bible?</p>
    <p class="mt-3">The Orthodox response is that Scripture never claims to be the only source of Christian teaching. Paul tells the Thessalonians to "stand firm and hold to the traditions that you were taught by us, either by our spoken word or by our letter" (2 Thess. 2:15). The "spoken word" here is Tradition. Paul does not privilege the written over the oral.</p>
    <p class="mt-3">Moreover, the very act of reading Scripture involves Tradition — you are reading a text that was selected, copied, translated, and handed down by the Church. The question is not "Scripture or Tradition?" but "which Tradition?" The Protestant Reformers did not escape Tradition; they substituted one tradition (the early medieval Western church) for another (their own novel reading). Orthodoxy claims to maintain the original apostolic Tradition in its fullness.</p>
  </div>
</details>`,
      readingAssignment: "Read 2 Thessalonians 2:13–15 and 1 Corinthians 11:1–2. Notice how St. Paul speaks about 'traditions' he has handed down. Then read a short passage from St. Irenaeus of Lyons, Against Heresies, Book III, Chapter 4, Section 1 (available freely at newadvent.org or tertullian.org). What does Irenaeus say about the role of the Church's oral tradition?",
      jurisdictionNotes: {
        OCA: "The OCA's theological education has been strongly shaped by Fr. Georges Florovsky and Fr. Alexander Schmemann, both of whom wrote extensively on Holy Tradition. Schmemann's For the Life of the World and Florovsky's Bible, Church, Tradition are formative texts in the OCA's tradition.",
        ANTIOCHIAN: "The Antiochian Archdiocese was the context for much of the Western Rite Orthodoxy experiment in America. The question of Tradition is alive in discussions about which rites and practices can legitimately be considered Orthodox.",
      },
      quiz: {
        questions: [
          {
            id: "q1",
            question: "Holy Tradition (capital T) in Orthodoxy refers to:",
            options: ["Human customs that accumulate over time", "The living transmission of the fullness of the faith by the Holy Spirit", "Only the writings of the Church Fathers", "The decisions of the Pope"],
            correctIndex: 1,
            explanation: "Holy Tradition is the life of the Holy Spirit in the Church — encompassing Scripture, the Creeds, the Councils, the Fathers, and the liturgical life.",
          },
          {
            id: "q2",
            question: "When St. Paul tells the Thessalonians to 'hold to the traditions' (2 Thess. 2:15), he refers to:",
            options: ["Only his written letters", "Both his spoken word and his letters", "The decisions of the Jerusalem council", "The Roman imperial law"],
            correctIndex: 1,
            explanation: "Paul explicitly includes both oral ('spoken word') and written ('letter') traditions — showing that the early Church did not restrict authoritative teaching to the written text alone.",
          },
          {
            id: "q3",
            question: "The 'Vincentian Canon' (St. Vincent of Lérins) defines the faith as that believed:",
            options: ["Only by bishops", "Only in the New Testament", "Everywhere, always, and by all", "By the Pope and his councils"],
            correctIndex: 2,
            explanation: "St. Vincent's rule — 'quod ubique, quod semper, quod ab omnibus' (everywhere, always, by all) — is a classic formulation of how Orthodoxy tests the authenticity of doctrine.",
          },
        ],
      },
    },
    {
      id: "lesson-inq-scripture-3",
      slug: "how-orthodoxy-reads-the-old-testament",
      title: "How Orthodoxy Reads the Old Testament",
      order: 3,
      estimatedMinutes: 20,
      contentMdx: `<p class="drop-cap">The Orthodox Church does not treat the Old Testament as a historical curiosity superseded by the New. It reads the entire Old Testament as pointing toward, and fulfilled in, Jesus Christ — but it does so with a richness and depth that surprises many first-time students.</p>

<h2>Typology: seeing Christ in the Old Testament</h2>

<p>The primary method of patristic interpretation of the Old Testament is <em>typology</em> — the understanding that persons, events, and institutions in Israel's history are "types" (Greek: <em>typos</em>, from <em>typtō</em>, "to strike, to imprint") that foreshadow the realities of the New Covenant. As St. Paul writes, "these things happened to them as examples [typoi] and were written down for our instruction" (1 Cor. 10:11).</p>

<p>Some classic types recognized by the Fathers:</p>

<ul style="list-style: disc; padding-left: 1.5em; margin-bottom: 1em;">
<li style="margin-bottom: 0.5em;"><strong>Adam</strong> is a type of Christ, the "last Adam" (1 Cor. 15:45). The first Adam's fall in a garden is answered by the last Adam's obedience in a garden (Gethsemane).</li>
<li style="margin-bottom: 0.5em;"><strong>The Passover lamb</strong> is a type of Christ, the Lamb of God (John 1:29). His blood on the doorposts foreshadows baptism and the Eucharist.</li>
<li style="margin-bottom: 0.5em;"><strong>Jonah's three days in the whale</strong> is a type of the Resurrection (Matt. 12:40).</li>
<li style="margin-bottom: 0.5em;"><strong>The bronze serpent</strong> lifted up by Moses is a type of Christ lifted up on the Cross (John 3:14).</li>
<li style="margin-bottom: 0.5em;"><strong>The Tabernacle and Temple</strong> are types of the Church and the human body as temples of the Holy Spirit.</li>
</ul>

<h2>The Septuagint: the Church's Old Testament</h2>

<p>Orthodoxy's Old Testament is the Septuagint (LXX) — the Greek translation made by Jewish scholars in Alexandria beginning in the third century BC. The Septuagint was the Bible of the New Testament authors; most Old Testament quotations in the New Testament are drawn from the LXX, not from the Hebrew Masoretic text. The early Church Fathers wrote in Greek and used the LXX as their Scripture.</p>

<p>This matters not merely as a historical fact but as a theological one. Certain messianic prophecies read differently in the LXX than in the Hebrew. Isaiah 7:14 in the LXX says "a virgin (parthenos) shall conceive" — the word the Evangelist Matthew cites (Matt. 1:23). The Hebrew reads "a young woman (almah)." Orthodoxy holds the LXX rendering to be providentially given.</p>

<blockquote>
<p>"The Septuagint is the authentic witness to the Old Testament as received by the Church. It is not a translation of the Old Testament but, along with the New Testament, constitutes the Christian Bible."<br/>— Metropolitan Kallistos Ware, <em>The Orthodox Church</em>, new edition (1993), p. 199.</p>
</blockquote>

<h2>The Psalter: the prayer book of the Church</h2>

<p>Of all the Old Testament books, the Psalter holds a unique place in Orthodox life. Monasteries read through the entire 150 psalms every week. The Psalms saturate the liturgical services — every Vespers, Matins, and Divine Liturgy is built around them. The Church has always understood the Psalms as the voice of Christ Himself (who prayed them) and the voice of the Church praying to God.</p>`,
      readingAssignment: "Read Psalm 22 (Psalm 21 in the LXX numbering). Notice how many details correspond to the Crucifixion narrative in the Gospels. Then read Matthew 27:35–46. Where do you see the psalm being 'enacted'? This is typology in action.",
      jurisdictionNotes: null,
      quiz: {
        questions: [
          {
            id: "q1",
            question: "In Orthodox typological reading, Adam is understood as a 'type' of Christ because:",
            options: ["Both were Jewish", "Both lived in gardens", "The first Adam's fall is answered by the last Adam's obedience", "Both performed miracles"],
            correctIndex: 2,
            explanation: "St. Paul calls Christ the 'last Adam' (1 Cor. 15:45). The pattern of fall and redemption, first in Adam and then reversed in Christ, is a foundational typological reading.",
          },
          {
            id: "q2",
            question: "The Septuagint (LXX) is important to Orthodoxy because:",
            options: ["It was written by the apostles", "It is the Greek Old Testament used by the New Testament authors and the early Church", "It was approved by the Council of Nicaea", "It is identical to the Hebrew Masoretic text"],
            correctIndex: 1,
            explanation: "The LXX is the Old Testament of the early Church, quoted throughout the New Testament and used by the Fathers. Orthodoxy treats it as providentially given.",
          },
        ],
      },
    },
    {
      id: "lesson-inq-scripture-4",
      slug: "the-fathers-as-interpreters",
      title: "The Church Fathers as Interpreters of Scripture",
      order: 4,
      estimatedMinutes: 25,
      contentMdx: `<p class="drop-cap">Every reading of Scripture involves interpretation. The question is not whether one will bring assumptions, frameworks, and contexts to the text, but which ones. Orthodox Christianity's answer is that the interpretation of the Church Fathers — the great saints and theologians of the first millennium — provides the normative framework within which Christians rightly read Scripture.</p>

<h2>Who are the Church Fathers?</h2>

<p>The term "Church Father" (Greek: <em>Pateres</em>) traditionally refers to the recognized teachers of the early Church whose writings are considered authoritative guides to Christian doctrine and interpretation. They are characterized by four qualities: antiquity, orthodox doctrine, holiness of life, and approval by the Church.</p>

<p>The Fathers span several centuries and regions:</p>

<ul style="list-style: disc; padding-left: 1.5em; margin-bottom: 1em;">
<li style="margin-bottom: 0.5em;"><strong>The Apostolic Fathers</strong> (late 1st–early 2nd c.): Clement of Rome, Ignatius of Antioch, Polycarp of Smyrna — men who knew the apostles personally.</li>
<li style="margin-bottom: 0.5em;"><strong>The Apologists</strong> (2nd c.): Justin Martyr, Athenagoras — who defended Christianity in the Greco-Roman world.</li>
<li style="margin-bottom: 0.5em;"><strong>The Great Theologians</strong> (3rd–5th c.): Origen (with caution), Athanasius, the Cappadocians (Basil of Caesarea, Gregory of Nyssa, Gregory the Theologian), John Chrysostom, Cyril of Alexandria, Augustine (in the West, with qualifications).</li>
<li style="margin-bottom: 0.5em;"><strong>The Later Fathers</strong> (6th–8th c.): Maximus the Confessor, Sophronius of Jerusalem, John of Damascus — who synthesized the patristic heritage.</li>
</ul>

<h2>The "consensus of the Fathers"</h2>

<p>Orthodox theology appeals not to any single Father in isolation but to the <em>consensus patrum</em> — the agreement of the Fathers on essential points. Where the Fathers speak with one voice, there is dogmatic teaching. Where they differ, there is theological opinion (theologoumenon) that may be held freely.</p>

<p>This is why Orthodox interpretation is not simply a matter of finding one patristic quote; it seeks the converging witness of multiple Fathers across centuries. The consistency of this witness is itself evidence of the Holy Spirit's guidance.</p>

<blockquote>
<p>"The mind of the Fathers is the mind of the Church. To read Scripture with the Fathers is not to read it with one school of interpretation; it is to read it with the Church."<br/>— Fr. John Meyendorff, <em>Living Tradition</em> (1978), p. 14.</p>
</blockquote>

<h2>John Chrysostom: preaching as exegesis</h2>

<p>Among the Fathers, St. John Chrysostom (347–407) is perhaps the greatest preacher and biblical interpreter of Orthodoxy. His homilies on Matthew, John, the Pauline Epistles, and Genesis are models of patristic exegesis: literal, moral, and spiritual at once, always drawing the hearer toward repentance and life in Christ. The Divine Liturgy used by the majority of Orthodox Christians bears his name.</p>

<p>Chrysostom understood the preacher's task as bringing the listener into the presence of Scripture as the living word. "The Scriptures were not given to be read once," he wrote, "but to be engraved on the heart."</p>`,
      readingAssignment: "Read John Chrysostom, Homily 1 on the Gospel of Matthew (available freely at newadvent.org/fathers). Notice how Chrysostom begins: with a question about why Matthew wrote his Gospel. What does his method of interpretation reveal about how the Fathers approached the text?",
      jurisdictionNotes: {
        OCA: "The OCA's St. Vladimir's Seminary Press has published excellent introductions to patristic reading, including The Study of God by Fr. Thomas Hopko and the Popular Patristics series.",
      },
      quiz: {
        questions: [
          {
            id: "q1",
            question: "The four traditional marks of a Church Father are: antiquity, orthodox doctrine, holiness of life, and:",
            options: ["Fluency in Latin", "Approval by the Church", "Having written a Gospel", "Having been martyred"],
            correctIndex: 1,
            explanation: "The classical definition of a Church Father requires approval by the Church — not every ancient Christian writer automatically qualifies.",
          },
          {
            id: "q2",
            question: "The 'consensus patrum' refers to:",
            options: ["A formal vote of all bishops", "The agreement of the Church Fathers on essential matters", "The writings of Pope Gregory the Great", "The decisions of the Council of Chalcedon"],
            correctIndex: 1,
            explanation: "The consensus of the Fathers — not one Father in isolation, but their converging agreement — is the normative standard for Orthodox interpretation.",
          },
        ],
      },
    },
    {
      id: "lesson-inq-scripture-5",
      slug: "the-seven-pillars-of-orthodox-hermeneutics",
      title: "How to Read Scripture as an Orthodox Christian",
      order: 5,
      estimatedMinutes: 20,
      contentMdx: `<p class="drop-cap">Reading Scripture as an Orthodox Christian is not simply a matter of individual study with a good commentary. It involves a whole way of approaching the text that has been formed over twenty centuries of prayer, worship, and theological reflection.</p>

<h2>Seven principles of Orthodox reading</h2>

<p><strong>1. Read in the Church.</strong> Scripture is the Church's book. Read it in the context of the Church's liturgical life — attending the services, hearing the texts proclaimed, praying the psalms. Private reading is enriched, not replaced, by this communal hearing.</p>

<p><strong>2. Read with the Fathers.</strong> Before forming your own interpretation of a difficult passage, ask: what did the Fathers say? Their witness is not infallible in every detail, but their consensus on matters of faith is authoritative.</p>

<p><strong>3. Read christologically.</strong> All Scripture points to Christ. The New Testament is the key that opens the Old. Christ Himself said of the Old Testament, "these are they which testify of me" (John 5:39). Seek the presence of Christ in every text.</p>

<p><strong>4. Read in context.</strong> Orthodoxy does not encourage proof-texting — pulling isolated verses from their literary and canonical context to support pre-formed conclusions. Each passage should be read in its immediate context, its canonical context, and its liturgical context.</p>

<p><strong>5. Read for transformation, not information.</strong> The goal of reading Scripture is not academic mastery but encounter with the living God. St. Isaac the Syrian: "Approach the words of the mystery with all your soul and all your heart, with fear and trembling."</p>

<p><strong>6. Read with humility.</strong> Some passages are difficult. The Fathers themselves disagreed on details. Hold your interpretations with appropriate tentativeness on matters not defined by the councils.</p>

<p><strong>7. Read with prayer.</strong> Before opening the Scripture, pray for the guidance of the Holy Spirit who inspired it. This is not a formality — it is the recognition that reading Scripture is an act of worship.</p>

<blockquote>
<p>"Let no day pass without reading some portion of the Holy Scriptures, and let it not be read carelessly, but slowly, with attention, and with prayer."<br/>— St. John Chrysostom (attributed)</p>
</blockquote>

<h2>The fourfold sense of Scripture</h2>

<p>The Fathers often read Scripture on multiple levels simultaneously:</p>

<ul style="list-style: disc; padding-left: 1.5em; margin-bottom: 1em;">
<li style="margin-bottom: 0.5em;"><strong>Literal/Historical:</strong> What the text says at the surface level — the historical events, the plain meaning of the words.</li>
<li style="margin-bottom: 0.5em;"><strong>Typological/Allegorical:</strong> The persons and events as types pointing to Christ and the Church.</li>
<li style="margin-bottom: 0.5em;"><strong>Moral/Tropological:</strong> The text as guidance for the Christian life and soul.</li>
<li style="margin-bottom: 0.5em;"><strong>Anagogical:</strong> The text as pointing to the heavenly realities, the eschatological Kingdom.</li>
</ul>

<p>These are not rigid categories applied mechanically; they are lenses through which Scripture naturally yields its fullness to the prayerful reader.</p>`,
      readingAssignment: "Take John 6:35–58 ('I am the bread of life...') and attempt to read it on all four levels: What is the literal/historical meaning? What is the typological meaning (how does it connect to Old Testament types)? What is the moral meaning (how should this change how I live)? What is the anagogical meaning (what heavenly reality does it point to)?",
      jurisdictionNotes: null,
      quiz: {
        questions: [
          {
            id: "q1",
            question: "According to Orthodox reading principles, the primary goal of reading Scripture is:",
            options: ["Academic mastery of the text", "Winning theological arguments", "Transformation — encounter with the living God", "Memorizing as many verses as possible"],
            correctIndex: 2,
            explanation: "Orthodox reading is ordered toward transformation and encounter, not information. St. Isaac the Syrian's counsel to approach Scripture 'with fear and trembling' points to this.",
          },
          {
            id: "q2",
            question: "The 'typological' or 'allegorical' level of Scripture interpretation refers to:",
            options: ["The plain historical meaning of the text", "Finding moral lessons for daily life", "Seeing Old Testament persons and events as types pointing to Christ", "The eschatological meaning pointing to the Kingdom"],
            correctIndex: 2,
            explanation: "The typological/allegorical level reads Old Testament persons and events as divinely-ordained foreshadowings of Christ, the Church, and the sacraments.",
          },
        ],
      },
    },
  ]

  for (const lessonData of inquirerLessons) {
    const { quiz, id, jurisdictionNotes, ...data } = lessonData
    const lesson = await prisma.lesson.upsert({
      where: { slug: data.slug },
      update: { ...data, courseId: inquirerCourse.id, status: "PUBLISHED", jurisdictionNotes: jurisdictionNotes as Prisma.InputJsonValue ?? Prisma.JsonNull },
      create: { id, ...data, courseId: inquirerCourse.id, status: "PUBLISHED", jurisdictionNotes: jurisdictionNotes as Prisma.InputJsonValue ?? Prisma.JsonNull },
    })
    if (quiz) {
      await prisma.quiz.upsert({
        where: { lessonId: lesson.id },
        update: { questions: quiz.questions },
        create: { lessonId: lesson.id, questions: quiz.questions },
      })
    }
  }
  console.log(`✓ ${inquirerLessons.length} inquirer lessons seeded`)

  // ── Catechumen Lessons ────────────────────────────────────────────────────
  const catechumenLessons = [
    {
      id: "lesson-cat-scripture-1",
      slug: "scripture-in-the-life-of-the-catechumen",
      title: "Scripture and the Catechumen: Reading as a Way of Life",
      order: 1,
      estimatedMinutes: 25,
      contentMdx: `<p class="drop-cap">You are preparing to enter the Orthodox Church. This means, among other things, that you are preparing to enter into a particular way of reading and inhabiting the Scriptures — one that has been shaped by twenty centuries of prayer, liturgy, and theological reflection. This lesson is about what that way of reading looks like in practice, and what it will ask of you.</p>

<h2>The Scriptures as formative text</h2>

<p>For the catechumen, Scripture is not primarily an academic subject. It is a formative text — one that shapes the reader, not merely informs them. The Fathers understood this well. St. Basil the Great wrote that "the soul that is nourished by the divine Scriptures grows spiritually." The reading of Scripture is an ascetic practice, like fasting or prayer, that purifies and orders the soul toward God.</p>

<p>This means that Scripture must be read regularly, slowly, and prayerfully. Many catechumens are encouraged to read the daily appointed Scripture readings from the Typikon — the liturgical calendar that assigns particular Epistle and Gospel readings to each day. This situates your personal reading within the Church's communal reading, which itself follows the rhythms of the fasting seasons, the festal cycle, and the commemorations of the saints.</p>

<h2>The Scriptures in the liturgical year</h2>

<p>The Orthodox liturgical year is structured as a reading of the entire New Testament (and much of the Old) aloud, in church, over the course of twelve months. The four Gospels are distributed across the year: Matthew is read during the long Pentecost season (summer), Mark is inserted throughout, Luke is read from the Sunday of the Publican and Pharisee through Great Lent, and John is read during the Paschal season and at the beginning of the liturgical year (September 1).</p>

<p>To become Orthodox is to enter this cycle — to have your year, your day, your sense of time, shaped by this continuous proclamation of the Word.</p>

<h2>The Rule of Prayer and Scripture</h2>

<p>The traditional Orthodox daily rule of prayer includes appointed Psalms, the Trisagion, and passages from the Epistles. Most Orthodox prayer books (such as the <em>Jordanville Prayer Book</em> or the <em>Prayer Book</em> published by Holy Trinity Monastery) include a short Scripture reading as part of the morning and evening prayers. Establishing this rule before chrismation is one of the most important preparations a catechumen can make.</p>

<blockquote>
<p>"The Orthodox Christian should read the Holy Scriptures every day. If he does not read them, how shall he know the will of God? How shall he nourish his spirit? You feed your body every day; feed your soul too."<br/>— St. Theophan the Recluse, <em>Letters on the Spiritual Life</em>, trans. Esther Williams (1995), p. 87.</p>
</blockquote>

<h2>Approaching the text: three cautions</h2>

<p><strong>First:</strong> Resist the temptation to treat Scripture as a proof-text arsenal. The Orthodox do not read Scripture primarily to win arguments or to establish doctrinal points by isolated verses. They read to encounter the living God and to be transformed by that encounter.</p>

<p><strong>Second:</strong> Resist private interpretation as the final word. The Fathers warn against reading Scripture in isolation from the Church's interpretive tradition. St. Peter himself wrote: "no prophecy of Scripture comes from someone's own interpretation" (2 Pet. 1:20). Your reading is enriched, not constrained, by the patristic consensus.</p>

<p><strong>Third:</strong> Resist impatience with difficulty. Some passages are genuinely difficult and have been debated by the Fathers. Hold your interpretation with humility, consult commentaries (St. John Chrysostom, St. Theophylact of Bulgaria, and the Ancient Christian Commentary on Scripture are excellent), and bring your questions to your priest.`,
      readingAssignment: "Obtain an Orthodox prayer book with daily Scripture readings (or use the online Typikon at orthocal.info). Follow the appointed Epistle and Gospel readings for one week. Notice how the readings are connected to the calendar and the saints' commemorations. Reflect in writing: what does it mean for Scripture to be a communal, liturgical document rather than a private one?",
      jurisdictionNotes: {
        OCA: "The OCA publishes daily Scripture readings at oca.org. The appointed readings follow the Byzantine Rite calendar. Many OCA catechesis programs use the Antiochian Archdiocese's catechetical materials as a supplement.",
        GOARCH: "The GOARCH publishes daily readings at goarch.org. The Greek Orthodox tradition has a strong tradition of biblical preaching; the sermons of Metropolitan Anthony Bloom (though ROCOR-origin) are widely read.",
        ROCOR: "ROCOR catechumens are often encouraged to use the Jordanville Prayer Book (published by Holy Trinity Monastery), which includes appointed Scripture readings and is closely aligned with the Typikon.",
      },
      quiz: {
        questions: [
          {
            id: "q1",
            question: "According to this lesson, what is the primary purpose of Scripture reading for an Orthodox catechumen?",
            options: ["Academic mastery", "Preparation for theological debate", "Formation and transformation — a way of life", "Historical research"],
            correctIndex: 2,
            explanation: "Scripture reading is an ascetic practice that forms the soul, not merely informs it. St. Basil and St. Theophan both emphasize this formative dimension.",
          },
          {
            id: "q2",
            question: "St. Peter's warning in 2 Pet. 1:20 ('no prophecy of Scripture comes from someone's own interpretation') is used in this lesson to caution against:",
            options: ["Reading Scripture in public", "Reading Scripture without a priest present", "Private interpretation as the final word, isolated from the Church's tradition", "Using modern translations"],
            correctIndex: 2,
            explanation: "Orthodox theology reads 2 Pet. 1:20 as a caution against isolated private interpretation that sets aside the Church's communal interpretive tradition.",
          },
        ],
      },
    },
    {
      id: "lesson-cat-scripture-2",
      slug: "the-canon-of-scripture-a-deeper-look",
      title: "The Canon of Scripture: A Deeper Look",
      order: 2,
      estimatedMinutes: 28,
      contentMdx: `<p class="drop-cap">The question of the biblical canon — which books belong in the Bible? — is one of the most consequential in the history of Christianity, and one of the most revealing of the fundamental difference between Orthodox and Protestant approaches to authority. As a catechumen, you need to understand not just what the Orthodox canon contains but <em>how</em> it came to be recognized, and what that process implies.</p>

<h2>The formation of the New Testament canon</h2>

<p>The twenty-seven books of the New Testament were not delivered from heaven in a bound volume. They were written over a period of roughly fifty years (c. 50–100 AD), circulated among communities, copied, read in worship, and gradually recognized as authoritative. The process of recognition took centuries.</p>

<p>Key moments include:</p>

<ul style="list-style: disc; padding-left: 1.5em; margin-bottom: 1em;">
<li style="margin-bottom: 0.5em;"><strong>Marcion (c. 140 AD)</strong> — the first known effort to define a canon, and a heretical one: Marcion rejected the Old Testament and most of the New, keeping only a truncated Paul and a modified Luke. The Church's response was to articulate more clearly which texts were authoritative.</li>
<li style="margin-bottom: 0.5em;"><strong>The Muratorian Fragment (c. 170–200 AD)</strong> — an early list of canonical books from Rome, which includes most of our current New Testament but differs in some details.</li>
<li style="margin-bottom: 0.5em;"><strong>Athanasius's Festal Letter 39 (367 AD)</strong> — the first document to list exactly the 27 books of our current New Testament as canonical.</li>
<li style="margin-bottom: 0.5em;"><strong>The Councils of Hippo (393) and Carthage (397)</strong> — Western councils that confirmed the canon.</li>
</ul>

<p>The Eastern Church was slightly more cautious about some books (Revelation, 2 and 3 John, 2 Peter, Jude) but arrived at the same list.</p>

<h2>The Orthodox Old Testament: why more books?</h2>

<p>The Orthodox Old Testament is larger than the Protestant because Orthodoxy follows the Septuagint (LXX) rather than the Hebrew Masoretic canon. The deuterocanonical books — Tobit, Judith, 1–2 Maccabees, Wisdom of Solomon, Sirach (Ecclesiasticus), Baruch, and additions to Esther and Daniel — were part of the Greek Bible used by the New Testament authors and the early Church.</p>

<p>The Protestant Reformers, led by Luther, removed these books from the Old Testament canon on the grounds that the Hebrew Bible (the Masoretic Text used by Jews in the first century) did not include them. Luther placed them in an appendix labeled "Apocrypha." The Orthodox Church has never accepted this decision, holding that the canon recognized by the early Church includes these texts.</p>

<blockquote>
<p>"The Septuagint is not simply a translation but a providential witness to the text of the Old Testament as received by the messianic community. The Church read it as Scripture because it found Christ in it."<br/>— Fr. John Behr, <em>The Way to Nicaea</em> (2001), p. 27.</p>
</blockquote>

<h2>The canon as an act of the Church</h2>

<p>The deepest point is this: the canon is itself a product of Tradition — of the Church's living discernment guided by the Holy Spirit. There is no "super-Scripture" that authorizes the canon; the canon was recognized through the Church's prayer, worship, and theological reflection over centuries. This is not a weakness; it is the testimony of the Spirit's presence in the Body of Christ.</p>

<p>This is why the Orthodox answer to "where did the Bible come from?" is always: "from the Church." And it is why the Orthodox answer to "who has the authority to interpret the Bible?" is also: "the Church, in the person of the Fathers and the Councils."</p>`,
      readingAssignment: "Read Athanasius of Alexandria, Festal Letter 39 (available at newadvent.org). This is the earliest document listing exactly our 27-book New Testament. Notice how Athanasius frames his authority for making this list. Then read the introduction to the deuterocanonical book of Sirach (Ecclesiasticus) — the translator's prologue. What does it tell us about the process by which texts were transmitted?",
      jurisdictionNotes: null,
      quiz: {
        questions: [
          {
            id: "q1",
            question: "The first person to attempt to define a written Christian canon was:",
            options: ["St. Athanasius", "Marcion", "St. Jerome", "Emperor Constantine"],
            correctIndex: 1,
            explanation: "Marcion (c. 140 AD) created the first known written canon — a heretical one that rejected the Old Testament. The Church's response helped clarify the authentic canon.",
          },
          {
            id: "q2",
            question: "The Orthodox Church includes the deuterocanonical books in its Old Testament because:",
            options: ["They were approved at the Council of Nicaea", "They follow the Septuagint, the Greek Bible used by the New Testament authors and early Church", "They were written by the Apostles", "The Pope approved them in the 16th century"],
            correctIndex: 1,
            explanation: "The deuterocanonical books were part of the Septuagint — the Old Testament of the New Testament authors and the early Church. Orthodoxy has never departed from this canon.",
          },
        ],
      },
    },
  ]

  for (const lessonData of catechumenLessons) {
    const { quiz, id, jurisdictionNotes, ...data } = lessonData
    const lesson = await prisma.lesson.upsert({
      where: { slug: data.slug },
      update: { ...data, courseId: catechumenCourse.id, status: "PUBLISHED", jurisdictionNotes: jurisdictionNotes as Prisma.InputJsonValue ?? Prisma.JsonNull },
      create: { id, ...data, courseId: catechumenCourse.id, status: "PUBLISHED", jurisdictionNotes: jurisdictionNotes as Prisma.InputJsonValue ?? Prisma.JsonNull },
    })
    if (quiz) {
      await prisma.quiz.upsert({
        where: { lessonId: lesson.id },
        update: { questions: quiz.questions },
        create: { lessonId: lesson.id, questions: quiz.questions },
      })
    }
  }
  console.log(`✓ ${catechumenLessons.length} catechumen lessons seeded`)

  // ── Reading Plan ─────────────────────────────────────────────────────────
  const planDays = Array.from({ length: 40 }, (_, i) => {
    const day = i + 1
    const johnChapters = [
      "John 1:1–18", "John 1:19–51", "John 2", "John 3:1–21", "John 3:22–36",
      "John 4:1–30", "John 4:31–54", "John 5:1–18", "John 5:19–47", "John 6:1–21",
      "John 6:22–59", "John 6:60–71", "John 7:1–24", "John 7:25–53", "John 8:1–20",
      "John 8:21–59", "John 9", "John 10:1–21", "John 10:22–42", "John 11:1–27",
      "John 11:28–57", "John 12:1–19", "John 12:20–50", "John 13:1–20", "John 13:21–38",
      "John 14:1–14", "John 14:15–31", "John 15:1–17", "John 15:18–27", "John 16:1–15",
      "John 16:16–33", "John 17:1–19", "John 17:20–26", "John 18:1–27", "John 18:28–40",
      "John 19:1–22", "John 19:23–42", "John 20:1–18", "John 20:19–31", "John 21",
    ]
    const chrysostomHomilies = [
      "Homily 1: The Prologue", "Homily 2: The Witness of John the Baptist", "Homily 3: The Wedding at Cana", "Homily 7: Nicodemus", "Homily 8: The Samaritan Woman",
      "Homily 11: The Feeding", "Homily 14: The Bread of Life", "Homily 22: I Am the Door", "Homily 25: The Resurrection of Lazarus", "Homily 35: The Last Supper",
    ]
    const reflections = [
      "The Word was 'in the beginning' — not created, but eternal. How does this change how you read the creation account in Genesis?",
      "John the Baptist says 'I am not worthy to untie His sandals.' What does this tell us about the proper posture before God?",
      "Jesus turns water into wine at a wedding. Why do you think the Incarnate God chose a wedding feast as the setting for His first sign?",
      "Nicodemus comes by night. Are there questions about faith you have been bringing only 'in the dark'?",
      "The Samaritan woman receives a revelation that the disciples have not yet received. What does this tell us about who God reveals Himself to?",
      "Jesus feeds five thousand. How is this a foreshadowing of the Eucharist?",
      "Christ says: 'Unless you eat my flesh and drink my blood, you have no life in you.' Many disciples left at this. What do you do with what is hard to receive?",
      "The Good Shepherd lays down His life. How is this different from a hireling's relationship to the flock?",
      "Lazarus is raised. Martha says: 'I know he will rise again in the resurrection at the last day.' Jesus says: 'I am the resurrection.' What is the difference?",
      "Jesus washes His disciples' feet. If the Master washes feet, what does this say about Christian leadership and service?",
    ]
    return {
      day,
      title: `Day ${day}: ${johnChapters[i]}`,
      scripture: johnChapters[i],
      fathersReading: day <= 10 && chrysostomHomilies[day - 1] ? `John Chrysostom, Homilies on John, ${chrysostomHomilies[day - 1]}` : undefined,
      reflection: reflections[(i) % reflections.length],
    }
  })

  await prisma.readingPlan.upsert({
    where: { id: "plan-gospel-john" },
    update: {
      title: "40 Days through the Gospel of John with Chrysostom",
      description: "A forty-day journey through St. John's Gospel, accompanied each day by readings from St. John Chrysostom's Homilies on John — the greatest patristic commentary on the Fourth Gospel. Each day includes a brief reflection prompt.",
      days: planDays,
    },
    create: {
      id: "plan-gospel-john",
      title: "40 Days through the Gospel of John with Chrysostom",
      description: "A forty-day journey through St. John's Gospel, accompanied each day by readings from St. John Chrysostom's Homilies on John — the greatest patristic commentary on the Fourth Gospel. Each day includes a brief reflection prompt.",
      days: planDays,
    },
  })
  console.log("✓ Reading plan seeded")

  // ── Live Classes (stub) ───────────────────────────────────────────────────
  const nextSunday = new Date()
  nextSunday.setDate(nextSunday.getDate() + ((7 - nextSunday.getDay()) % 7 || 7))
  nextSunday.setHours(18, 0, 0, 0)

  await prisma.liveClass.upsert({
    where: { id: "class-scripture-intro" },
    update: {
      title: "Introduction to Orthodox Scripture: A Live Session",
      description: "A live question-and-answer session covering the material from the Scripture & Holy Tradition pillar. Bring your questions. Hosted via Zoom.",
      startsAt: nextSunday,
      joinUrl: null,
      pillarId: pillars["scripture-and-tradition"].id,
    },
    create: {
      id: "class-scripture-intro",
      title: "Introduction to Orthodox Scripture: A Live Session",
      description: "A live question-and-answer session covering the material from the Scripture & Holy Tradition pillar. Bring your questions. Hosted via Zoom.",
      startsAt: nextSunday,
      joinUrl: null,
      pillarId: pillars["scripture-and-tradition"].id,
    },
  })
  console.log("✓ Live class seeded")

  console.log("\n✓ Seed complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
