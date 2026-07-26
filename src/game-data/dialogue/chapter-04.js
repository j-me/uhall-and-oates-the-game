export const chapterFourDialogue = {
  opening: 'OATES: The London shipping label led here. The Reardons built their own little customs checkpoint to classify contract shipments before they enter the shipping routes.',
  shop: {
    look: 'The record shop once mailed promotional singles. Its old dispatch stamp has a rotating barrel: one side reads “ROUTE COPY WITHHELD,” the other “ROUTE COPY RELEASED.”',
    take: 'You take the reversible routing stamp. One turn of its barrel changes WITHHELD into RELEASED—the entire music business in one office supply.',
  },
  michael: {
    look: 'Michael McDonald is studying a shipping label beside a portable keyboard with an unusually authoritative sustain pedal.',
    talk: 'MICHAEL: That checkpoint rejects anything without an artist-export authorization. Their carbon forms hide the authorization beneath the rejection copy.\nOATES: How do we reveal it?\nMICHAEL: Bring me one. A little vibration can make paperwork confess.',
    missing: 'MICHAEL: I can sign, seal, and musically agitate a form, but first I need the rejected carbon copy.',
    success: 'Michael lays the rejected form across his keyboard and plays one magnificent administrative chord. The vibration exposes its hidden carbon copy. He signs it, seals it with a keyboard-company sticker, and hands it back.\nMICHAEL: Signed, sealed, and ready to be delivered.\nOATES: Subtle.\nMICHAEL: I have never been accused of that.',
  },
  customs: {
    look: 'An unofficial checkpoint run by Reardon staff. The desk keeps every shipment’s destination hidden from the shipping map unless an authorized form is stamped “ROUTE COPY RELEASED.” Its fixed desk stamp only says “WITHHELD.”',
    talk: 'OATES: You work for customs?\nCLERK: I work for the paperwork. Customs is merely the costume.',
    needsAuthorization: 'CLERK: I cannot release a route copy without an artist-export authorization. Even our invented rules have paperwork.',
    authorized: 'The clerk studies Michael’s signed-and-sealed authorization, recognizes more confidence than legality, and files it without another question.',
    success: 'With Michael’s authorization on file, Oates fits the record shop’s rotating stamp into the desk press, turns WITHHELD to RELEASED, and stamps the Reardon route copy. The shipping map can now read the London label’s concealed destination.',
  },
  noCanDo: {
    look: 'A rejected shipping form stamped “NO CAN DO.” A faint second sheet is trapped beneath the rejection copy, and the reason given is “too much soul for standard shipping.”',
    talk: 'OATES: Can I appeal this?\nFORM: NO CAN DO.\nOATES: You sound like my old contracts.',
    use: 'The faint carbon marks refuse to become readable. The paper may need a different kind of persuasion.',
    take: 'Oates frees the rejected form from its unusually confident paperclip. Something nearly legible is hiding in the carbon layer.',
  },
  map: { look: 'Colored shipping lines cross like a very anxious orchestra. The map refuses to display destinations from labels whose route copies are marked “WITHHELD.”', talk: 'OATES: The Reardons dug up a buried clause in their old artist contracts. Their machine treats a singer’s recorded voice as a new signature, then claims the singer agreed to reactivate the old contract and return under label control. Daryl is their key.', missing: 'The map flashes “ROUTE COPY WITHHELD.” The checkpoint must release the route before this label will reveal its destination.', complete: 'The released London shipping label and route map reveal Tokyo: the Reardons are calibrating the Recall Clause machine there. It uses Daryl’s voice to falsely claim he agreed to reactivate old Reardon contracts and return under label control. Daryl is still alive.', success: 'The route map accepts the released copy, draws a line to Tokyo, and prints a temporary access pass. Daryl is being moved to the recording truck, where the Reardons are making the fake agreement signal.' },
};
