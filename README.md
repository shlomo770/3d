# PRO GIS PLATFORM v12

גרסה זו מוסיפה שכבת ארכיטקטורה וקונפיגורציה מסודרת, כדי שהפרויקט יהיה מתאים כבסיס לפרויקטים גדולים.

## עיקרון

רוב השליטה במערכת נמצאת ב־2 קבצים:

```txt
src/core/config/designTokens.ts
src/core/config/platformConfig.ts
```

## מה מוגדר בקונפיג

- עיצוב וצבעים
- רוחב פאנלים
- הצגת/הסתרת פאנלים
- תפריט צד
- פריטי Status Bar
- כלי ציור
- רשימת שכבות
- מודולים בפאנל שמאל
- מודולים בפאנל ימין
- מפה ראשית
- חלון 3D
- HUD
- Targets layers

## מודולים נתיקים

```txt
src/core/config/moduleRegistry.ts
```

כל מודול מוגדר עם:
- id
- slot
- enabled
- detachable
- description

## הרצה

```bat
cd pro-gis-platform-v12
npm config set registry https://registry.npmjs.org/
npm install --registry=https://registry.npmjs.org/
npm run dev
```

## התאמה לפרויקט עתידי

כדי להתאים את המערכת לפרויקט אחר, מתחילים רק מ:

```txt
src/core/config/platformConfig.ts
src/core/config/designTokens.ts
```

ולא נוגעים במנועי המפה, בעריכה או בסימולטור.
