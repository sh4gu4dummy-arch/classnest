from PIL import Image, ImageDraw, ImageFont
F='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
def font(s):
    try: return ImageFont.truetype(F,s)
    except: return ImageFont.load_default()
BG='#f6f4ef'
# review sheet
W=1000; big=270; small=150
rows=[('OLD (live today)',[('old/34-s1.jpg','Hatchling'),('old/34-s2.jpg','Adolescent'),('old/34-s3.jpg','Legend')],big,'#222'),
      ('NEW PICKS',[('picks/34-s1.jpg','Hatchling (kept)'),('picks/34-s2.jpg','Apprentice = s2 B'),('picks/34-s3.jpg','Hearth-Sage = s3 F')],big,'#15803d')]
opt=[('Adolescent',[('options/s2-optA.jpg','s2 A  pour'),('options/s2-optB.jpg','s2 B  PICK  apprentice'),('options/s2-optC.jpg','s2 C  rune book (letter-like runes)'),('options/s2-optD.jpg','s2 D  ladder')]),
     ('Legend 1',[('options/s3-optA.jpg','s3 A  robed sage (runner-up)'),('options/s3-optB.jpg','s3 B  pour on books'),('options/s3-optC.jpg','s3 C  wanderer')]),
     ('Legend 2',[('options/s3-optD.jpg','s3 D  balcony elder'),('options/s3-optE.jpg','s3 E  near-copy of A'),('options/s3-optF.jpg','s3 F  PICK  spectacles sage')])]
H=50+2*(big+40)+40+3*(small+36)+20
im=Image.new('RGB',(W,H),BG); d=ImageDraw.Draw(im)
d.text((10,10),'Kindlekin #34 trial (draft, local only, not in the app)',fill='#111',font=font(22))
y=50
for label,items,sz,col in rows:
    d.text((10,y+sz//2-8),label,fill=col,font=font(14))
    for i,(f,cap) in enumerate(items):
        x=170+i*(sz+12); im.paste(Image.open(f).convert('RGB').resize((sz,sz),Image.LANCZOS),(x,y)); d.text((x,y+sz+4),cap,fill='#333',font=font(12))
    y+=sz+40
d.text((10,y),'ALL OPTIONS',fill='#111',font=font(15)); y+=28
for label,items in opt:
    d.text((10,y+small//2-8),label,fill='#333',font=font(13))
    for i,(f,cap) in enumerate(items):
        x=170+i*(small+55); im.paste(Image.open(f).convert('RGB').resize((small,small),Image.LANCZOS),(x,y))
        d.text((x,y+small+3),cap,fill='#15803d' if 'PICK' in cap else ('#b91c1c' if ('near-copy' in cap or 'letter' in cap) else '#555'),font=font(10))
    y+=small+36
im.save('review.png')
# phone check: 390x844 CSS px rendered at 2x
S=2; PW,PH=390*S,844*S
ph=Image.new('RGB',(PW,PH),'#1e1b2e'); d=ImageDraw.Draw(ph)
d.rectangle((0,0,PW,56*S),fill='#ea580c'); d.text((14*S,16*S),'Board (390x844 phone)',fill='white',font=font(16*S))
y=70*S
for title,files in [('OLD',['old/34-s1.jpg','old/34-s2.jpg','old/34-s3.jpg']),('NEW',['picks/board/34-s1.jpg','picks/board/34-s2.jpg','picks/board/34-s3.jpg'])]:
    d.text((14*S,y),title+' - board thumbs (360px file, ~114px card)',fill='white',font=font(12*S)); y+=22*S
    card=114*S; gap=(PW-3*card)//4
    for i,f in enumerate(files):
        x=gap+i*(card+gap); t=Image.open(f).convert('RGB').resize((360,360),Image.LANCZOS).resize((card,card),Image.LANCZOS)
        d.rounded_rectangle((x-3*S,y-3*S,x+card+3*S,y+card+26*S),radius=10*S,fill='#2d2945'); ph.paste(t,(x,y))
        d.text((x+4*S,y+card+6*S),['Hatchling','Apprentice','Hearth-Sage'][i],fill='#fde68a',font=font(11*S))
    y+=card+44*S
d.text((14*S,y),'NEW - small avatar size (56px)',fill='white',font=font(12*S)); y+=22*S
for i,f in enumerate(['picks/board/34-s1.jpg','picks/board/34-s2.jpg','picks/board/34-s3.jpg','picks/board/34-s3-alt-A.jpg']):
    t=Image.open(f).resize((56*S,56*S),Image.LANCZOS); m=Image.new('L',t.size,0); ImageDraw.Draw(m).ellipse((0,0,56*S,56*S),fill=255)
    ph.paste(t,(20*S+i*80*S,y),m)
d.text((20*S+3*80*S-6*S,y+60*S),'alt s3 A',fill='#ccc',font=font(10*S))
y+=90*S
d.text((14*S,y),'NEW - Legend pick full width',fill='white',font=font(12*S)); y+=22*S
ph.paste(Image.open('picks/34-s3.jpg').resize((362*S,362*S),Image.LANCZOS) if y+362*S<PH else Image.open('picks/34-s3.jpg').resize((PH-y-8*S,PH-y-8*S),Image.LANCZOS),(14*S,y))
ph.save('phone-check.png')
