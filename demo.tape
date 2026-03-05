Output demo.gif
Set FontSize 14
Set Width 920
Set Height 580
Set Shell "zsh"
Set Theme "Catppuccin Mocha"
Set TypingSpeed 30ms
Set Padding 20

Type "node"
Enter
Sleep 1s

Type "const { romanizeKorean, fiveElementsForStrokes } = await import('namefyi')"
Enter
Sleep 1.5s

Type "romanizeKorean('김철수')"
Enter
Sleep 2s

Type "romanizeKorean('서울특별시')"
Enter
Sleep 2s

Type "fiveElementsForStrokes(8, 7, 3)"
Enter
Sleep 2.5s

Type ".exit"
Enter
Sleep 1s
