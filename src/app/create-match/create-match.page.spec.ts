import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { CreateMatchComponent } from './create-match.page';

describe('Tab2Page', () => {
  let component: CreateMatchComponent;
  let fixture: ComponentFixture<CreateMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateMatchComponent],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
