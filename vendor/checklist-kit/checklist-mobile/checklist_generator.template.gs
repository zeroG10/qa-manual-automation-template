/**
 * QA Checklist generator — canonical MOBILE template (28 cols A..AB).
 * Hierarchy (Vadym, 16/06/2026): Screen → Section → Check (the mobile
 * analog of web's Page → Section → Check).
 *
 * Mobile structure (Vadym, 17/06/2026): every platform block carries TWO
 * status columns (a platform pair, e.g. iOS + Android in block 1) instead
 * of a single platform with a comments-extension column. Per-row result
 * and page-band status formulas scan the combined pair so a row is "Failed"
 * if EITHER platform is "Failed", etc.
 *
 * Use this template when the design under test is a mobile/app screen.
 * The web variant lives in /Projects/_templates/checklist/ (25 cols).
 *
 * To create a new mobile checklist:
 *   1. Copy this file to <Project>/<project>_checklist.gs
 *   2. Rename `createChecklist` to `create<Project>Checklist`
 *   3. Update FOLDER_PATH, FILE_NAME, AUTHOR, PLATFORMS
 *   4. Fill the design with `addPage('<Screen name> screen')`, `addSection`,
 *      `item` calls
 *   5. Copy the matching generate_via_api.template.mjs to the same dir
 *
 * Column layout (28 cols):
 *   A B | C D E F G H | I J | K | L M N O P Q | R S | T | U V W X Y Z | AA AB
 *   ↑name+text  ↑block 1 group: 2 status + 3 counters + spacer
 *   ↑block 1 result   ↑between   ↑block 2 group   ↑result   ↑between
 *   ↑block 3 group     ↑block 3 result
 *
 * Column groups (CLAUDE.md, Vadym 10/06/2026): C:H, L:Q, U:Z.
 * All other workspace rules (toggle on the right, B4 hidden, group cleanup,
 * page-name mirror, per-section row groups) apply identically to web.
 */
function createChecklist() {
  var FOLDER_PATH = ['Projects', '<Project Name>', 'QA Documentation'];
  var FILE_NAME   = '<Project Name> - checklist';
  var SHEET_NAME  = 'Checklist';
  var AUTHOR      = 'Vadym';
  // Labels shown in row 2 under each block. Each block has two platform
  // sub-columns (s1, s2). Default = iOS + Android in all 3 blocks (one
  // block per testing round / build / regression pass). Override per
  // project, e.g. iPad + Android Tablet for a tablet round. Use '' for an
  // unused slot.
  var PLATFORMS = [
    ['iOS', 'Android'],
    ['iOS', 'Android'],
    ['iOS', 'Android']
  ];

  var folder = DriveApp.getRootFolder();
  FOLDER_PATH.forEach(function (name) {
    var it = folder.getFoldersByName(name);
    folder = it.hasNext() ? it.next() : folder.createFolder(name);
  });

  var ss;
  var files = folder.getFilesByName(FILE_NAME);
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    ss = SpreadsheetApp.create(FILE_NAME);
    DriveApp.getFileById(ss.getId()).moveTo(folder);
  }

  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  ['Sheet1', 'Аркуш1'].forEach(function (n) {
    var sh = ss.getSheetByName(n);
    if (sh && ss.getSheets().length > 1 && n !== SHEET_NAME) ss.deleteSheet(sh);
  });

  var full = sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
  full.breakApart();
  full.clear();
  full.clearDataValidations();
  sheet.setConditionalFormatRules([]);

  // ── Layout constants (mobile variant: 28 cols A..AB) ────────────────
  var NCOLS = 28;
  var COLORS = {
    teal:    '#134f5c', tealFg:  '#f3f3f3', blue:    '#699ebf',
    passBg:  '#d2ebda', passFg:  '#135522',
    failBg:  '#f8d5da', failFg:  '#701c22',
    gray:    '#d9d9d9', grayFg:  '#434343',
    cntPass: '#b6d7a8', cntFail: '#f4cccc',
    pageBg:  '#b7b7b7', statusBg:'#efefef', resultBg:'#f3f3f3',
    purple:  '#8E7BC3', white:   '#ffffff'
  };
  var WIDTHS = [150, 530,
                130, 130, 85, 85, 85, 19,  // C..H  block 1 group (s1 s2 c1 c2 c3 sp)
                82, 84,                     // I J   block 1 result
                18,                         // K     between-block spacer
                130, 130, 85, 85, 85, 19,  // L..Q  block 2 group
                82, 84,                     // R S   block 2 result
                18,                         // T     between-block spacer
                130, 130, 85, 85, 85, 23,  // U..Z  block 3 group
                78, 79];                    // AA AB block 3 result
  // Each block: s1, s2 = 2 status cols; c1..c3 = 3 counter cols; rA, rB = 2 result cols.
  var BLOCKS = [
    { s1: 3,  s2: 4,  c1: 5,  c3: 7,  rA: 9,  rB: 10 },
    { s1: 12, s2: 13, c1: 14, c3: 16, rA: 18, rB: 19 },
    { s1: 21, s2: 22, c1: 23, c3: 25, rA: 27, rB: 28 }
  ];
  var SPACERS = [8, 11, 17, 20, 26]; // H, K, Q, T, Z

  function cl(n) {
    if (n <= 26) return String.fromCharCode(64 + n);
    return String.fromCharCode(64 + Math.floor((n - 1) / 26)) + String.fromCharCode(65 + ((n - 1) % 26));
  }
  // Per-row result formula scanning a platform-pair range (e.g. C7:D7).
  // Returns "Failed" if any cell is Failed, "Passed" if any Passed,
  // "Skipped" if any Skipped, else "".  Vadym 17/06/2026 form preserved.
  function pairResultFormula(s1L, s2L, row) {
    var rng = s1L + row + ':' + s2L + row;
    return '=IF(AND(COUNTIF(' + rng + '; "Failed") > 0; COUNTIF(' + rng + '; "<>") = COUNTA(' + rng + ')); "Failed"; ' +
           'IF(AND(COUNTIF(' + rng + '; "Passed") > 0; COUNTIF(' + rng + '; "<>") = COUNTA(' + rng + ')); "Passed"; ' +
           'IF(AND(COUNTIF(' + rng + '; "Skipped") > 0; COUNTIF(' + rng + '; "<>") = COUNTA(' + rng + ')); "Skipped"; ' +
           'IF(COUNTBLANK(' + rng + ') = COUNTA(' + rng + '); ""; ""))))';
  }

  // ── Pages / sections / checks ───────────────────────────────────────
  var VISUAL = 'Check that the fonts, sizes, colors and spacing in this section match the Figma design';
  var PAGES = [];
  var _curPage = null, _curSection = null;
  function addPage(name) {
    _curPage = { name: name, sections: [] };
    PAGES.push(_curPage);
    _curSection = null;
  }
  function addSection(name) {
    if (!_curPage) throw new Error('Call addPage(...) before addSection(...)');
    _curSection = { name: name, checks: [VISUAL] };
    _curPage.sections.push(_curSection);
  }
  function item(text) {
    if (!_curSection) throw new Error('Call addSection(...) before item(...)');
    _curSection.checks.push(text);
  }

  // ── EXAMPLE — replace with real screens/sections from the Figma design
  addPage('Example screen');
  addSection('Example Section');
  item('Check that <element> is displayed and behaves as expected per the design');
  // ────────────────────────────────────────────────────────────────────

  // ── Build grid ──────────────────────────────────────────────────────
  var tz = ss.getSpreadsheetTimeZone() || Session.getScriptTimeZone();
  var monthYear = Utilities.formatDate(new Date(), tz, 'MMMM yyyy');
  var year      = Utilities.formatDate(new Date(), tz, 'yyyy');

  function er() { return new Array(NCOLS).fill(''); }
  var grid = [er(), er(), er(), er()];
  var merges = [];
  var heights = { 1: 50, 2: 59, 3: 25, 4: 36 };

  grid[0][0] = 'Module';
  grid[0][1] = 'Checklist\nUp to date according to ' + monthYear;
  grid[3][1] = 'created by ' + AUTHOR + ' =)';
  merges.push([1, 1, 4, 1]);
  merges.push([1, 2, 3, 1]);

  BLOCKS.forEach(function (b, bi) {
    var s1L = cl(b.s1), s2L = cl(b.s2);
    grid[0][b.s1 - 1] = 'Platform';
    grid[1][b.s1 - 1] = (PLATFORMS[bi] && PLATFORMS[bi][0]) || '';
    grid[1][b.s2 - 1] = (PLATFORMS[bi] && PLATFORMS[bi][1]) || '';
    grid[0][b.c1 - 1] = 'Available Statuses /\nSummary counter by all platforms';
    grid[1][b.c1 - 1] = 'Passed';
    grid[1][b.c1]     = 'Failed';
    grid[1][b.c3 - 1] = 'Skipped';
    // Row-3 block counters scan BOTH status cols of the block
    grid[2][b.c1 - 1] = '=COUNTIF(' + s1L + ':' + s2L + ';"Passed")';
    grid[2][b.c1]     = '=COUNTIF(' + s1L + ':' + s2L + ';"Failed")';
    grid[2][b.c3 - 1] = '=COUNTIF(' + s1L + ':' + s2L + ';"Skipped")';
    grid[3][b.c1 - 1] = 'Comments';
    grid[0][b.rA - 1] = 'Checked\nxx/xx/' + year;
    grid[1][b.rA - 1] = 'Total/\nCheck counter per item';
    grid[3][b.rA - 1] = 'Passed';
    grid[3][b.rB - 1] = 'Failed';
    merges.push([1, b.s1, 1, 2]);             // C1:D1 "Platform" header spans the pair
    merges.push([2, b.s1, 3, 1]);             // s1 platform label spans rows 2-4
    merges.push([2, b.s2, 3, 1]);             // s2 platform label spans rows 2-4
    merges.push([1, b.c1, 1, 3]);             // "Available Statuses" header spans c1..c3
    merges.push([4, b.c1, 1, 3]);             // "Comments" header spans c1..c3
    merges.push([1, b.rA, 1, 2]);             // "Checked" header spans rA..rB
    merges.push([2, b.rA, 1, 2]);             // "Total" header spans rA..rB
  });

  var pageLayout = [];

  PAGES.forEach(function (p) {
    var pageTop    = grid.length + 1;
    var counterRow = pageTop + 1;
    var firstCheck = pageTop + 2;
    var nTotal = p.sections.reduce(function (a, s) { return a + s.checks.length; }, 0);
    var lastCheck = firstCheck + nTotal - 1;

    var r1 = er(), r2 = er();
    r1[0] = p.name;
    BLOCKS.forEach(function (b) {
      var s1L = cl(b.s1), s2L = cl(b.s2), rAL = cl(b.rA);
      // Page-band combined-status formula: scans s1:s2 range
      r1[b.s1 - 1] = '=IF(COUNTIF(' + s1L + firstCheck + ':' + s2L + lastCheck + ';"Failed")>0;"Not all issues are resolved!";"")';
      // Page name mirror in the result block (Vadym, 16/06/2026)
      r1[b.rA - 1] = '=A' + pageTop;
      r2[b.rA - 1] = '=COUNTIF(' + rAL + firstCheck + ':' + rAL + lastCheck + ';"Passed")';
      r2[b.rB - 1] = '=COUNTIF(' + rAL + firstCheck + ':' + rAL + lastCheck + ';"Failed")';
      merges.push([pageTop, b.s1, 2, 2]);     // s1+s2 merged across 2 rows
      merges.push([pageTop, b.c1, 2, 3]);     // comments zone (c1..c3) × 2 rows
      merges.push([pageTop, b.rA, 1, 2]);     // page-name cell (rA..rB)
    });
    merges.push([pageTop, 1, 2, 2]);          // A:B page band (name)
    // pageTop is autoResized below to fit the page-name mirror cells
    heights[pageTop + 1] = 24;
    grid.push(r1, r2);

    var sectionLayouts = [];
    p.sections.forEach(function (s) {
      var sectionStart = grid.length + 1;
      s.checks.forEach(function (text) {
        var row = grid.length + 1;
        var r = er();
        r[1] = text;
        BLOCKS.forEach(function (b) {
          r[b.rA - 1] = pairResultFormula(cl(b.s1), cl(b.s2), row);
          merges.push([row, b.c1, 1, 3]);  // comments zone 3 cols wide
          merges.push([row, b.rA, 1, 2]);  // result 2 cols wide
        });
        // No explicit height — autoResize fits each row to wrapped content
        grid.push(r);
      });
      var sectionEnd = grid.length;
      grid[sectionStart - 1][0] = s.name;
      if (sectionEnd > sectionStart) merges.push([sectionStart, 1, sectionEnd - sectionStart + 1, 1]);
      sectionLayouts.push({ start: sectionStart, end: sectionEnd });
    });

    pageLayout.push({
      pageTop: pageTop, counterRow: counterRow,
      firstCheck: firstCheck, lastCheck: lastCheck,
      sections: sectionLayouts
    });
  });

  BLOCKS.forEach(function (b) {
    var passCells = pageLayout.map(function (L) { return cl(b.rA) + L.counterRow; });
    var failCells = pageLayout.map(function (L) { return cl(b.rB) + L.counterRow; });
    grid[2][b.rA - 1] = '=SUM(' + passCells.join(';') + ')';
    grid[2][b.rB - 1] = '=SUM(' + failCells.join(';') + ')';
  });

  var LAST = grid.length;

  sheet.getRange(1, 1, LAST, NCOLS).setValues(grid);
  merges.forEach(function (m) { sheet.getRange(m[0], m[1], m[2], m[3]).merge(); });

  full.setFontFamily('Arial');

  var tealCells = ['A1', 'B1', 'B4'];
  BLOCKS.forEach(function (b) {
    tealCells.push(cl(b.s1) + '1');
    tealCells.push(cl(b.c1) + '1');
    tealCells.push(cl(b.rA) + '1');
  });
  tealCells.forEach(function (a1) {
    sheet.getRange(a1).setBackground(COLORS.teal).setFontColor(COLORS.tealFg)
      .setFontWeight('bold').setFontSize(13)
      .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
  });
  sheet.getRange('A4').setBackground(COLORS.teal);
  sheet.getRange('B4').setFontColor(COLORS.teal);

  BLOCKS.forEach(function (b) {
    // Both platform sub-columns get the blue platform-label background
    // Platform sub-labels (s1, s2) — size 13 (Vadym, 17/06/2026)
    sheet.getRange(2, b.s1).setBackground(COLORS.blue).setFontWeight('bold').setFontSize(13)
      .setHorizontalAlignment('center').setVerticalAlignment('middle');
    sheet.getRange(2, b.s2).setBackground(COLORS.blue).setFontWeight('bold').setFontSize(13)
      .setHorizontalAlignment('center').setVerticalAlignment('middle');
    sheet.getRange(2, b.rA).setBackground(COLORS.blue).setFontWeight('bold').setFontSize(11)
      .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
    sheet.getRange(2, b.c1).setBackground(COLORS.passBg).setFontColor(COLORS.passFg).setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');
    sheet.getRange(2, b.c1 + 1).setBackground(COLORS.failBg).setFontColor(COLORS.failFg).setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');
    sheet.getRange(2, b.c3).setBackground(COLORS.gray).setFontColor(COLORS.grayFg).setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');
    sheet.getRange(3, b.c1).setBackground(COLORS.cntPass).setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
    sheet.getRange(3, b.c1 + 1).setBackground(COLORS.cntFail).setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
    sheet.getRange(3, b.c3).setBackground(COLORS.gray).setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
    sheet.getRange(3, b.rA).setBackground(COLORS.cntPass).setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
    sheet.getRange(3, b.rB).setBackground(COLORS.cntFail).setFontWeight('bold').setFontSize(12).setHorizontalAlignment('center');
    // Row 4 — "Comments" label size 14, "Passed"/"Failed" labels size 11 (Vadym, 17/06/2026)
    sheet.getRange(4, b.c1).setBackground(COLORS.gray).setFontWeight('bold').setFontSize(14).setHorizontalAlignment('center');
    sheet.getRange(4, b.rA).setBackground(COLORS.passBg).setFontColor(COLORS.passFg).setFontWeight('bold').setFontSize(11).setHorizontalAlignment('center');
    sheet.getRange(4, b.rB).setBackground(COLORS.failBg).setFontColor(COLORS.failFg).setFontWeight('bold').setFontSize(11).setHorizontalAlignment('center');
  });

  SPACERS.forEach(function (col) {
    sheet.getRange(1, col, LAST, 1).setBackground(COLORS.gray);
  });

  var validation = SpreadsheetApp.newDataValidation()
    .requireValueInList(['Passed', 'Failed', 'Skipped'], true)
    .setAllowInvalid(false).build();

  pageLayout.forEach(function (L) {
    sheet.getRange(L.pageTop, 1, 2, NCOLS).setBackground(COLORS.pageBg);
    sheet.getRange(L.pageTop, 1).setFontWeight('bold').setFontSize(13)
      .setHorizontalAlignment('left').setVerticalAlignment('middle').setWrap(true);
    BLOCKS.forEach(function (b) {
      sheet.getRange(L.pageTop, b.s1).setFontWeight('bold').setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
      // Page-band name mirror (I5:J5 / R5:S5 / AA5:AB5 etc.) — size 12 (Vadym, 17/06/2026)
      sheet.getRange(L.pageTop, b.rA).setFontWeight('bold').setFontSize(12)
        .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
      sheet.getRange(L.counterRow, b.rA).setBackground(COLORS.cntPass).setFontWeight('bold').setHorizontalAlignment('center');
      sheet.getRange(L.counterRow, b.rB).setBackground(COLORS.cntFail).setFontWeight('bold').setHorizontalAlignment('center');
    });
    // Auto-fit pageTop row so the narrow mirror cells grow to fit long page names (Vadym, 17/06/2026)
    sheet.autoResizeRows(L.pageTop, 1);

    var n = L.lastCheck - L.firstCheck + 1;
    sheet.getRange(L.firstCheck, 1, n, 2).setBackground(COLORS.white);
    sheet.getRange(L.firstCheck, 2, n, 1).setWrap(true).setFontSize(10)
      .setVerticalAlignment('middle');
    BLOCKS.forEach(function (b) {
      // Both platform status cols get dropdown validation
      sheet.getRange(L.firstCheck, b.s1, n, 1).setBackground(COLORS.statusBg).setDataValidation(validation)
        .setHorizontalAlignment('center').setVerticalAlignment('middle');
      sheet.getRange(L.firstCheck, b.s2, n, 1).setBackground(COLORS.statusBg).setDataValidation(validation)
        .setHorizontalAlignment('center').setVerticalAlignment('middle');
      sheet.getRange(L.firstCheck, b.c1, n, 3).setBackground(COLORS.statusBg);
      sheet.getRange(L.firstCheck, b.rA, n, 2).setBackground(COLORS.resultBg)
        .setHorizontalAlignment('center').setVerticalAlignment('middle');
    });
    // Auto-fit row height to wrapped content (Vadym, 17/06/2026)
    sheet.autoResizeRows(L.firstCheck, n);

    // Section name col A — font size 11 (Vadym, 17/06/2026), vertically merged
    // Section-aware borders on A:B (Vadym, 17/06/2026)
    L.sections.forEach(function (s, idx) {
      var sn = s.end - s.start + 1;
      sheet.getRange(s.start, 1, sn, 1)
        .setFontWeight('bold').setFontSize(11)
        .setHorizontalAlignment('center').setVerticalAlignment('middle').setWrap(true);
      sheet.getRange(s.start, 1, sn, NCOLS).shiftRowGroupDepth(1);

      var addTop = idx > 0;
      sheet.getRange(s.start, 1, sn, 1).setBorder(addTop || null, true, true, true, null, null);
      sheet.getRange(s.start, 2, sn, 1).setBorder(null, true, null, null, null, null);
      sheet.getRange(s.end, 2).setBorder(null, null, true, null, null, null);
      if (addTop) sheet.getRange(s.start, 2).setBorder(true, null, null, null, null, null);
    });
  });

  WIDTHS.forEach(function (w, i) { sheet.setColumnWidth(i + 1, w); });
  for (var r = 1; r <= LAST; r++) { if (heights[r]) sheet.setRowHeight(r, heights[r]); }
  sheet.setFrozenRows(4);
  sheet.setFrozenColumns(2);

  ['C1:H1', 'L1:Q1', 'U1:Z1'].forEach(function (a1) {
    sheet.getRange(a1).shiftColumnGroupDepth(1);
  });
  sheet.setColumnGroupControlAfter(true);

  function cfRanges(a1list) {
    return a1list.map(function (a1) { return sheet.getRange(a1); });
  }
  // Both status sub-columns + result pairs + row-2 status labels
  var statusRanges = cfRanges([
    'C1:D199', 'I1:J199', 'L1:M199', 'R1:S199', 'U1:V199', 'AA1:AB199',
    'E2:G2',   'N2:P2',   'W2:Y2'
  ]);
  // Purple "Not all issues..." applies only to the page-band status zone
  // (both status cols of every block) — same range as the formula target.
  var purpleRanges = cfRanges([
    'C1:D199', 'L1:M199', 'U1:V199',
    'E2:G2',   'N2:P2',   'W2:Y2'
  ]);
  var rules = [
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Skipped')
      .setBackground('#D9D9D9').setFontColor('#434343').setBold(true).setRanges(statusRanges).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Passed')
      .setBackground('#D2EBDA').setFontColor('#135522').setBold(true).setRanges(statusRanges).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Failed')
      .setBackground('#F8D5DA').setFontColor('#701C22').setBold(true).setRanges(statusRanges).build(),
    SpreadsheetApp.newConditionalFormatRule().whenTextContains('Not all issues are resolved!')
      .setBackground('#8E7BC3').setFontColor('#F3F3F3').setBold(true).setRanges(purpleRanges).build()
  ];
  sheet.setConditionalFormatRules(rules);

  var nSections = PAGES.reduce(function (a, p) { return a + p.sections.length; }, 0);
  var nChecks   = PAGES.reduce(function (a, p) { return a + p.sections.reduce(function (b, s) { return b + s.checks.length; }, 0); }, 0);
  Logger.log('Done: ' + PAGES.length + ' screens, ' + nSections + ' sections, ' + nChecks + ' checks, ' + LAST + ' rows.');
  Logger.log('URL: ' + ss.getUrl());
}
