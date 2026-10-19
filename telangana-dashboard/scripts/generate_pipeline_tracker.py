import json

def build_tracker():
    with open('public/data/telangana_elections.json') as f:
        d = json.load(f)

    res = d['results']['2023']
    sorted_acs = sorted(res.values(), key=lambda x: x['margin'])

    phase1_acs = []
    phase2_acs = []

    for i, ac in enumerate(sorted_acs):
        ac_no = ac['ac_no']
        is_sirpur = (ac_no == 1)
        item = {
            'ac_no': ac_no,
            'ac_name': ac['ac_name'],
            'district': ac['district'],
            'margin': ac['margin'],
            'winner_party': ac['winner']['party'],
            'runner_party': ac['runner_up']['party'],
            'status': 'READY' if is_sirpur else 'PENDING',
            'phase': 1 if i < 20 else 2,
            'priority_rank': i + 1,
            'extracted_booths': 16 if is_sirpur else 0,
            'storage_path': f'/data/voters/ac_{ac_no}/'
        }
        if i < 20:
            phase1_acs.append(item)
        else:
            phase2_acs.append(item)

    tracker = {
        'total_constituencies': len(sorted_acs),
        'phase1_battlegrounds_count': len(phase1_acs),
        'phase2_remaining_count': len(phase2_acs),
        'completed_acs': [1],
        'pending_phase1_acs': [x['ac_no'] for x in phase1_acs if x['status'] == 'PENDING'],
        'phase1_list': phase1_acs,
        'phase2_list': phase2_acs
    }

    with open('public/data/voter_roll_pipeline_tracker.json', 'w', encoding='utf-8') as f:
        json.dump(tracker, f, indent=2)

    print(f"Pipeline Tracker generated successfully: {len(phase1_acs)} Phase 1 ACs, {len(phase2_acs)} Phase 2 ACs.")

if __name__ == '__main__':
    build_tracker()

